import { Request, Response } from "express";
import axios from 'axios';

const CARDINALS_TEAM_ID = 138;
const MLB_API_BASE = 'https://statsapi.mlb.com/api/v1';

const getCardinalsRecord = async (): Promise<{ wins: number; losses: number } | null> => {
    try {
        // Fetch current standings for NL (leagueId=104) and AL (103). Use current year.
        const currentYear = new Date().getFullYear();
        const response = await axios.get(`${MLB_API_BASE}/standings?leagueId=103,104&season=${currentYear}&hydrate=team(record)`);
        const data = response.data;

        // Find Cardinals in records
        for (const league of data.records) {
            for (const division of league.divisionAll) {
                const team = division.teamRecords.find((t: any) => t.team.id === CARDINALS_TEAM_ID);
                if (team) {
                    const record = team.leagueRecord;
                    return { wins: record.wins, losses: record.losses };
                }
            }
        }
        return null;
    } catch (error) {
        console.error('Error fetching MLB data:', error);
        return null;
    }
};

const getResponse = async (req: Request, res: Response) => {
    const record = await getCardinalsRecord();
    let frames: any[] = [];

    if (record) {
        const recordText = `STL: ${record.wins}-${record.losses}`;
        frames = [
            {
                text: recordText,
                icon: 120  // Baseball icon ID
            }
        ];
    } else {
        // Fallback for off-season or errors
        frames = [
            {
                text: "Cardinals: Off-Season",
                icon: 120
            }
        ];
    }

    return res.status(200).json({ frames });
};

export { getResponse };
