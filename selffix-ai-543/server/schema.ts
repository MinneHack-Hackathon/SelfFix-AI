import { pgTable, serial, text, integer, boolean, date, timestamp, numeric } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const cases = pgTable('cases', {
    id: serial('id').primaryKey(),
    applianceType: text('appliance_type').notNull(),
    brand: text('brand').notNull(),
    model: text('model').notNull(),
    symptoms: text('symptoms').array().notNull(),
    additionalNotes: text('additional_notes'),
    diagnosticSteps: text('diagnostic_steps').array().notNull().default([]),
    rootCause: text('root_cause').notNull(),
    partReplaced: text('part_replaced').notNull(),
    partCost: numeric('part_cost', { precision: 10, scale: 2 }).notNull().default('0'),
    laborTimeMinutes: integer('labor_time_minutes').notNull().default(0),
    diyFeasibility: text('diy_feasibility').notNull().default('Easy'),
    successful: boolean('successful').notNull().default(true),
    date: date('date').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Generate base schemas from the table
const baseInsertSchema = createInsertSchema(cases);
const baseSelectSchema = createSelectSchema(cases);

// Create custom insert schema with validation
export const insertCaseSchema = z.object({
    applianceType: z.string().min(1, 'Appliance type is required'),
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    symptoms: z.array(z.string()).min(1, 'At least one symptom is required'),
    additionalNotes: z.string().optional().nullable(),
    diagnosticSteps: z.array(z.string()).default([]),
    rootCause: z.string().min(1, 'Root cause is required'),
    partReplaced: z.string().min(1, 'Part replaced is required'),
    partCost: z.union([z.string(), z.number()]).transform(val => String(val)).default('0'),
    laborTimeMinutes: z.number().min(0, 'Labor time cannot be negative').default(0),
    diyFeasibility: z.enum(['Easy', 'Moderate', 'Professional Required']).default('Easy'),
    successful: z.boolean().default(true),
    date: z.string().optional(),
});

export const selectCaseSchema = baseSelectSchema;

export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;
