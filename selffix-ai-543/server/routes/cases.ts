import { Router } from 'express';
import { db } from '../db.ts';
import { cases, insertCaseSchema } from '../schema.ts';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const casesRouter = Router();

// GET /api/cases - List all cases
casesRouter.get('/', async (_req, res) => {
    try {
        const allCases = await db.select().from(cases);
        res.json(allCases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: 'Failed to fetch cases' });
    }
});

// GET /api/cases/:id - Get single case
casesRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid case ID' });
        }

        const [caseData] = await db.select().from(cases).where(eq(cases.id, id));

        if (!caseData) {
            return res.status(404).json({ error: 'Case not found' });
        }

        res.json(caseData);
    } catch (error) {
        console.error('Error fetching case:', error);
        res.status(500).json({ error: 'Failed to fetch case' });
    }
});

// POST /api/cases - Create new case
casesRouter.post('/', async (req, res) => {
    try {
        // Validate request body
        const validatedData = insertCaseSchema.parse(req.body);

        // Insert into database (cast to avoid TS errors with drizzle+zod)
        const [newCase] = await db.insert(cases).values(validatedData as any).returning();

        res.status(201).json(newCase);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.errors
            });
        }
        console.error('Error creating case:', error);
        res.status(500).json({ error: 'Failed to create case' });
    }
});

// PUT /api/cases/:id - Update case
casesRouter.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid case ID' });
        }

        const validatedData = insertCaseSchema.parse(req.body);

        const [updatedCase] = await db
            .update(cases)
            .set({ ...validatedData as any, updatedAt: new Date() })
            .where(eq(cases.id, id))
            .returning();

        if (!updatedCase) {
            return res.status(404).json({ error: 'Case not found' });
        }

        res.json(updatedCase);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.errors
            });
        }
        console.error('Error updating case:', error);
        res.status(500).json({ error: 'Failed to update case' });
    }
});

// DELETE /api/cases/:id - Delete case
casesRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid case ID' });
        }

        const [deletedCase] = await db
            .delete(cases)
            .where(eq(cases.id, id))
            .returning();

        if (!deletedCase) {
            return res.status(404).json({ error: 'Case not found' });
        }

        res.json({ message: 'Case deleted successfully', case: deletedCase });
    } catch (error) {
        console.error('Error deleting case:', error);
        res.status(500).json({ error: 'Failed to delete case' });
    }
});
