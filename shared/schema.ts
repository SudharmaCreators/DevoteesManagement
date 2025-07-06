import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("viewer"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Devotees table
export const devotees = pgTable("devotees", {
  id: serial("id").primaryKey(),
  devoteeId: varchar("devotee_id").notNull().unique(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique(),
  phone: varchar("phone"),
  whatsappNumber: varchar("whatsapp_number"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender"),
  address: text("address"),
  city: varchar("city"),
  state: varchar("state"),
  country: varchar("country").default("India"),
  pincode: varchar("pincode"),
  occupation: varchar("occupation"),
  profileImageUrl: varchar("profile_image_url"),
  emergencyContact: varchar("emergency_contact"),
  emergencyContactNumber: varchar("emergency_contact_number"),
  bloodGroup: varchar("blood_group"),
  spiritualLevel: varchar("spiritual_level"),
  joinDate: timestamp("join_date").defaultNow(),
  mentorId: integer("mentor_id").references(() => mentors.id),
  familyId: integer("family_id").references(() => families.id),
  isActive: boolean("is_active").notNull().default(true),
  qrCodeData: text("qr_code_data"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Families table
export const families = pgTable("families", {
  id: serial("id").primaryKey(),
  familyName: varchar("family_name").notNull(),
  headOfFamily: varchar("head_of_family").notNull(),
  address: text("address"),
  city: varchar("city"),
  state: varchar("state"),
  country: varchar("country").default("India"),
  pincode: varchar("pincode"),
  totalMembers: integer("total_members").default(0),
  joinDate: timestamp("join_date").defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mentors table
export const mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique(),
  phone: varchar("phone"),
  specialization: varchar("specialization"),
  experience: integer("experience"),
  maxDevotees: integer("max_devotees").default(20),
  currentDevotees: integer("current_devotees").default(0),
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendance table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  devoteeId: integer("devotee_id").references(() => devotees.id).notNull(),
  eventId: integer("event_id").references(() => events.id),
  date: timestamp("date").notNull(),
  status: varchar("status").notNull(), // present, absent, late, excused
  notes: text("notes"),
  recordedBy: varchar("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Donations table
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  devoteeId: integer("devotee_id").references(() => devotees.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  donationType: varchar("donation_type").notNull(), // cash, online, cheque, kind
  purpose: varchar("purpose"),
  paymentMethod: varchar("payment_method"),
  transactionId: varchar("transaction_id"),
  receiptNumber: varchar("receipt_number"),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  isAnonymous: boolean("is_anonymous").default(false),
  taxExemptible: boolean("tax_exemptible").default(false),
  recordedBy: varchar("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  eventType: varchar("event_type").notNull(), // satsang, festival, workshop, meeting
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  maxParticipants: integer("max_participants"),
  registrationRequired: boolean("registration_required").default(false),
  isActive: boolean("is_active").notNull().default(true),
  organizerId: varchar("organizer_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event participation table
export const eventParticipation = pgTable("event_participation", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  devoteeId: integer("devotee_id").references(() => devotees.id).notNull(),
  registrationDate: timestamp("registration_date").defaultNow(),
  participationStatus: varchar("participation_status").default("registered"), // registered, attended, missed
  feedback: text("feedback"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Volunteering table
export const volunteering = pgTable("volunteering", {
  id: serial("id").primaryKey(),
  devoteeId: integer("devotee_id").references(() => devotees.id).notNull(),
  eventId: integer("event_id").references(() => events.id),
  activityType: varchar("activity_type").notNull(), // seva, decoration, cooking, management
  hours: decimal("hours", { precision: 4, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  supervisorId: integer("supervisor_id").references(() => mentors.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Groups table
export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  groupType: varchar("group_type").notNull(), // bhajan, satsang, seva, study
  location: varchar("location"),
  maxMembers: integer("max_members"),
  currentMembers: integer("current_members").default(0),
  leaderId: integer("leader_id").references(() => devotees.id),
  meetingSchedule: text("meeting_schedule"),
  whatsappLink: varchar("whatsapp_link"),
  telegramLink: varchar("telegram_link"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Group memberships table
export const groupMemberships = pgTable("group_memberships", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => groups.id).notNull(),
  devoteeId: integer("devotee_id").references(() => devotees.id).notNull(),
  joinDate: timestamp("join_date").defaultNow(),
  role: varchar("role").default("member"), // member, coordinator, assistant
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Dashboard layouts table
export const dashboardLayouts = pgTable("dashboard_layouts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  layout: jsonb("layout").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  theme: varchar("theme").default("devotional"),
  language: varchar("language").default("en"),
  notifications: jsonb("notifications").default({}),
  dashboardLayout: integer("dashboard_layout").references(() => dashboardLayouts.id),
  preferences: jsonb("preferences").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  preferences: one(userPreferences),
  dashboardLayouts: many(dashboardLayouts),
  organizedEvents: many(events),
}));

export const devoteesRelations = relations(devotees, ({ one, many }) => ({
  mentor: one(mentors, { fields: [devotees.mentorId], references: [mentors.id] }),
  family: one(families, { fields: [devotees.familyId], references: [families.id] }),
  attendance: many(attendance),
  donations: many(donations),
  eventParticipation: many(eventParticipation),
  volunteering: many(volunteering),
  groupMemberships: many(groupMemberships),
  ledGroups: many(groups),
}));

export const familiesRelations = relations(families, ({ many }) => ({
  members: many(devotees),
}));

export const mentorsRelations = relations(mentors, ({ many }) => ({
  devotees: many(devotees),
  supervisedVolunteering: many(volunteering),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  devotee: one(devotees, { fields: [attendance.devoteeId], references: [devotees.id] }),
  event: one(events, { fields: [attendance.eventId], references: [events.id] }),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  devotee: one(devotees, { fields: [donations.devoteeId], references: [devotees.id] }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, { fields: [events.organizerId], references: [users.id] }),
  attendance: many(attendance),
  participation: many(eventParticipation),
  volunteering: many(volunteering),
}));

export const eventParticipationRelations = relations(eventParticipation, ({ one }) => ({
  event: one(events, { fields: [eventParticipation.eventId], references: [events.id] }),
  devotee: one(devotees, { fields: [eventParticipation.devoteeId], references: [devotees.id] }),
}));

export const volunteeringRelations = relations(volunteering, ({ one }) => ({
  devotee: one(devotees, { fields: [volunteering.devoteeId], references: [devotees.id] }),
  event: one(events, { fields: [volunteering.eventId], references: [events.id] }),
  supervisor: one(mentors, { fields: [volunteering.supervisorId], references: [mentors.id] }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  leader: one(devotees, { fields: [groups.leaderId], references: [devotees.id] }),
  memberships: many(groupMemberships),
}));

export const groupMembershipsRelations = relations(groupMemberships, ({ one }) => ({
  group: one(groups, { fields: [groupMemberships.groupId], references: [groups.id] }),
  devotee: one(devotees, { fields: [groupMemberships.devoteeId], references: [devotees.id] }),
}));

export const dashboardLayoutsRelations = relations(dashboardLayouts, ({ one }) => ({
  user: one(users, { fields: [dashboardLayouts.userId], references: [users.id] }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, { fields: [userPreferences.userId], references: [users.id] }),
  dashboardLayout: one(dashboardLayouts, { fields: [userPreferences.dashboardLayout], references: [dashboardLayouts.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
  isActive: true,
});

export const insertDevoteeSchema = createInsertSchema(devotees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFamilySchema = createInsertSchema(families).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMentorSchema = createInsertSchema(mentors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVolunteeringSchema = createInsertSchema(volunteering).omit({
  id: true,
  createdAt: true,
});

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDashboardLayoutSchema = createInsertSchema(dashboardLayouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertDevotee = z.infer<typeof insertDevoteeSchema>;
export type Devotee = typeof devotees.$inferSelect;
export type InsertFamily = z.infer<typeof insertFamilySchema>;
export type Family = typeof families.$inferSelect;
export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type Mentor = typeof mentors.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertVolunteering = z.infer<typeof insertVolunteeringSchema>;
export type Volunteering = typeof volunteering.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type Group = typeof groups.$inferSelect;
export type InsertDashboardLayout = z.infer<typeof insertDashboardLayoutSchema>;
export type DashboardLayout = typeof dashboardLayouts.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
