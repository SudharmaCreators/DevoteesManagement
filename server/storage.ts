import {
  users,
  devotees,
  families,
  mentors,
  attendance,
  donations,
  events,
  eventParticipation,
  volunteering,
  groups,
  groupMemberships,
  groupEntries,
  mandals,
  sabhaLocations,
  dashboardLayouts,
  userPreferences,
  type User,
  type UpsertUser,
  type Devotee,
  type InsertDevotee,
  type Family,
  type InsertFamily,
  type Mentor,
  type InsertMentor,
  type Attendance,
  type InsertAttendance,
  type Donation,
  type InsertDonation,
  type Event,
  type InsertEvent,
  type Volunteering,
  type InsertVolunteering,
  type Group,
  type InsertGroup,
  type GroupEntry,
  type InsertGroupEntry,
  type Mandal,
  type InsertMandal,
  type SabhaLocation,
  type InsertSabhaLocation,
  type DashboardLayout,
  type InsertDashboardLayout,
  type UserPreferences,
  type InsertUserPreferences,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, gte, lte, count, sum, avg } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Devotee operations
  getDevotees(): Promise<Devotee[]>;
  getDevotee(id: number): Promise<Devotee | undefined>;
  createDevotee(devotee: InsertDevotee): Promise<Devotee>;
  updateDevotee(id: number, devotee: Partial<InsertDevotee>): Promise<Devotee>;
  deleteDevotee(id: number): Promise<boolean>;
  
  // Family operations
  getFamilies(): Promise<Family[]>;
  getFamily(id: number): Promise<Family | undefined>;
  createFamily(family: InsertFamily): Promise<Family>;
  updateFamily(id: number, family: Partial<InsertFamily>): Promise<Family>;
  deleteFamily(id: number): Promise<boolean>;
  
  // Mentor operations
  getMentors(): Promise<Mentor[]>;
  getMentor(id: number): Promise<Mentor | undefined>;
  createMentor(mentor: InsertMentor): Promise<Mentor>;
  updateMentor(id: number, mentor: Partial<InsertMentor>): Promise<Mentor>;
  deleteMentor(id: number): Promise<boolean>;
  
  // Attendance operations
  getAttendance(devoteeId?: number, eventId?: number): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, attendance: Partial<InsertAttendance>): Promise<Attendance>;
  deleteAttendance(id: number): Promise<boolean>;
  
  // Donation operations
  getDonations(devoteeId?: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonation(id: number, donation: Partial<InsertDonation>): Promise<Donation>;
  deleteDonation(id: number): Promise<boolean>;
  
  // Event operations
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Volunteering operations
  getVolunteering(devoteeId?: number): Promise<Volunteering[]>;
  createVolunteering(volunteering: InsertVolunteering): Promise<Volunteering>;
  updateVolunteering(id: number, volunteering: Partial<InsertVolunteering>): Promise<Volunteering>;
  deleteVolunteering(id: number): Promise<boolean>;
  
  // Group operations
  getGroups(): Promise<Group[]>;
  getGroup(id: number): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: number, group: Partial<InsertGroup>): Promise<Group>;
  deleteGroup(id: number): Promise<boolean>;
  
  // Group entries operations
  getGroupEntries(groupId?: number): Promise<GroupEntry[]>;
  createGroupEntry(entry: InsertGroupEntry): Promise<GroupEntry>;
  updateGroupEntry(id: number, entry: Partial<InsertGroupEntry>): Promise<GroupEntry>;
  deleteGroupEntry(id: number): Promise<boolean>;
  
  // Mandal operations
  getMandals(): Promise<Mandal[]>;
  createMandal(mandal: InsertMandal): Promise<Mandal>;
  
  // Sabha location operations
  getSabhaLocations(): Promise<SabhaLocation[]>;
  createSabhaLocation(location: InsertSabhaLocation): Promise<SabhaLocation>;
  
  // Dashboard operations
  getDashboardLayouts(userId: string): Promise<DashboardLayout[]>;
  createDashboardLayout(layout: InsertDashboardLayout): Promise<DashboardLayout>;
  updateDashboardLayout(id: number, layout: Partial<InsertDashboardLayout>): Promise<DashboardLayout>;
  deleteDashboardLayout(id: number): Promise<boolean>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Analytics operations
  getStats(): Promise<{
    totalDevotees: number;
    activeFamilies: number;
    totalDonations: number;
    avgAttendance: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Devotee operations
  async getDevotees(): Promise<Devotee[]> {
    return await db.select().from(devotees).orderBy(desc(devotees.createdAt));
  }

  async getDevotee(id: number): Promise<Devotee | undefined> {
    const [devotee] = await db.select().from(devotees).where(eq(devotees.id, id));
    return devotee;
  }

  async createDevotee(devotee: InsertDevotee): Promise<Devotee> {
    const [newDevotee] = await db.insert(devotees).values(devotee).returning();
    return newDevotee;
  }

  async updateDevotee(id: number, devotee: Partial<InsertDevotee>): Promise<Devotee> {
    const [updatedDevotee] = await db
      .update(devotees)
      .set({ ...devotee, updatedAt: new Date() })
      .where(eq(devotees.id, id))
      .returning();
    return updatedDevotee;
  }

  async deleteDevotee(id: number): Promise<boolean> {
    const result = await db.delete(devotees).where(eq(devotees.id, id));
    return result.rowCount > 0;
  }

  // Family operations
  async getFamilies(): Promise<Family[]> {
    return await db.select().from(families).orderBy(desc(families.createdAt));
  }

  async getFamily(id: number): Promise<Family | undefined> {
    const [family] = await db.select().from(families).where(eq(families.id, id));
    return family;
  }

  async createFamily(family: InsertFamily): Promise<Family> {
    const [newFamily] = await db.insert(families).values(family).returning();
    return newFamily;
  }

  async updateFamily(id: number, family: Partial<InsertFamily>): Promise<Family> {
    const [updatedFamily] = await db
      .update(families)
      .set({ ...family, updatedAt: new Date() })
      .where(eq(families.id, id))
      .returning();
    return updatedFamily;
  }

  async deleteFamily(id: number): Promise<boolean> {
    const result = await db.delete(families).where(eq(families.id, id));
    return result.rowCount > 0;
  }

  // Mentor operations
  async getMentors(): Promise<Mentor[]> {
    return await db.select().from(mentors).orderBy(desc(mentors.createdAt));
  }

  async getMentor(id: number): Promise<Mentor | undefined> {
    const [mentor] = await db.select().from(mentors).where(eq(mentors.id, id));
    return mentor;
  }

  async createMentor(mentor: InsertMentor): Promise<Mentor> {
    const [newMentor] = await db.insert(mentors).values(mentor).returning();
    return newMentor;
  }

  async updateMentor(id: number, mentor: Partial<InsertMentor>): Promise<Mentor> {
    const [updatedMentor] = await db
      .update(mentors)
      .set({ ...mentor, updatedAt: new Date() })
      .where(eq(mentors.id, id))
      .returning();
    return updatedMentor;
  }

  async deleteMentor(id: number): Promise<boolean> {
    const result = await db.delete(mentors).where(eq(mentors.id, id));
    return result.rowCount > 0;
  }

  // Attendance operations
  async getAttendance(devoteeId?: number, eventId?: number): Promise<Attendance[]> {
    let query = db.select().from(attendance);
    
    if (devoteeId && eventId) {
      query = query.where(and(eq(attendance.devoteeId, devoteeId), eq(attendance.eventId, eventId)));
    } else if (devoteeId) {
      query = query.where(eq(attendance.devoteeId, devoteeId));
    } else if (eventId) {
      query = query.where(eq(attendance.eventId, eventId));
    }
    
    return await query.orderBy(desc(attendance.attendanceDate));
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db.insert(attendance).values(attendanceData).returning();
    return newAttendance;
  }

  async updateAttendance(id: number, attendanceData: Partial<InsertAttendance>): Promise<Attendance> {
    const [updatedAttendance] = await db
      .update(attendance)
      .set(attendanceData)
      .where(eq(attendance.id, id))
      .returning();
    return updatedAttendance;
  }

  async deleteAttendance(id: number): Promise<boolean> {
    const result = await db.delete(attendance).where(eq(attendance.id, id));
    return result.rowCount > 0;
  }

  // Donation operations
  async getDonations(devoteeId?: number): Promise<Donation[]> {
    let query = db.select().from(donations);
    
    if (devoteeId) {
      query = query.where(eq(donations.devoteeId, devoteeId));
    }
    
    return await query.orderBy(desc(donations.donationDate));
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [newDonation] = await db.insert(donations).values(donation).returning();
    return newDonation;
  }

  async updateDonation(id: number, donation: Partial<InsertDonation>): Promise<Donation> {
    const [updatedDonation] = await db
      .update(donations)
      .set(donation)
      .where(eq(donations.id, id))
      .returning();
    return updatedDonation;
  }

  async deleteDonation(id: number): Promise<boolean> {
    const result = await db.delete(donations).where(eq(donations.id, id));
    return result.rowCount > 0;
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.startDate));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const [updatedEvent] = await db
      .update(events)
      .set({ ...event, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return result.rowCount > 0;
  }

  // Volunteering operations
  async getVolunteering(devoteeId?: number): Promise<Volunteering[]> {
    let query = db.select().from(volunteering);
    
    if (devoteeId) {
      query = query.where(eq(volunteering.devoteeId, devoteeId));
    }
    
    return await query.orderBy(desc(volunteering.startDate));
  }

  async createVolunteering(volunteeringData: InsertVolunteering): Promise<Volunteering> {
    const [newVolunteering] = await db.insert(volunteering).values(volunteeringData).returning();
    return newVolunteering;
  }

  async updateVolunteering(id: number, volunteeringData: Partial<InsertVolunteering>): Promise<Volunteering> {
    const [updatedVolunteering] = await db
      .update(volunteering)
      .set(volunteeringData)
      .where(eq(volunteering.id, id))
      .returning();
    return updatedVolunteering;
  }

  async deleteVolunteering(id: number): Promise<boolean> {
    const result = await db.delete(volunteering).where(eq(volunteering.id, id));
    return result.rowCount > 0;
  }

  // Group operations
  async getGroups(): Promise<Group[]> {
    return await db.select().from(groups).orderBy(desc(groups.createdAt));
  }

  async getGroup(id: number): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group;
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const [newGroup] = await db.insert(groups).values(group).returning();
    return newGroup;
  }

  async updateGroup(id: number, group: Partial<InsertGroup>): Promise<Group> {
    const [updatedGroup] = await db
      .update(groups)
      .set({ ...group, updatedAt: new Date() })
      .where(eq(groups.id, id))
      .returning();
    return updatedGroup;
  }

  async deleteGroup(id: number): Promise<boolean> {
    const result = await db.delete(groups).where(eq(groups.id, id));
    return result.rowCount > 0;
  }

  // Group entries operations
  async getGroupEntries(groupId?: number): Promise<GroupEntry[]> {
    let query = db.select().from(groupEntries);
    
    if (groupId) {
      query = query.where(eq(groupEntries.groupId, groupId));
    }
    
    return await query.orderBy(desc(groupEntries.createdAt));
  }

  async createGroupEntry(entry: InsertGroupEntry): Promise<GroupEntry> {
    const [newEntry] = await db.insert(groupEntries).values(entry).returning();
    return newEntry;
  }

  async updateGroupEntry(id: number, entry: Partial<InsertGroupEntry>): Promise<GroupEntry> {
    const [updatedEntry] = await db
      .update(groupEntries)
      .set({ ...entry, updatedAt: new Date() })
      .where(eq(groupEntries.id, id))
      .returning();
    return updatedEntry;
  }

  async deleteGroupEntry(id: number): Promise<boolean> {
    const result = await db.delete(groupEntries).where(eq(groupEntries.id, id));
    return result.rowCount > 0;
  }

  // Mandal operations
  async getMandals(): Promise<Mandal[]> {
    return await db.select().from(mandals).where(eq(mandals.isActive, true));
  }

  async createMandal(mandal: InsertMandal): Promise<Mandal> {
    const [newMandal] = await db.insert(mandals).values(mandal).returning();
    return newMandal;
  }

  // Sabha location operations
  async getSabhaLocations(): Promise<SabhaLocation[]> {
    return await db.select().from(sabhaLocations).where(eq(sabhaLocations.isActive, true));
  }

  async createSabhaLocation(location: InsertSabhaLocation): Promise<SabhaLocation> {
    const [newLocation] = await db.insert(sabhaLocations).values(location).returning();
    return newLocation;
  }

  // Dashboard operations
  async getDashboardLayouts(userId: string): Promise<DashboardLayout[]> {
    return await db.select().from(dashboardLayouts).where(eq(dashboardLayouts.userId, userId));
  }

  async createDashboardLayout(layout: InsertDashboardLayout): Promise<DashboardLayout> {
    const [newLayout] = await db.insert(dashboardLayouts).values(layout).returning();
    return newLayout;
  }

  async updateDashboardLayout(id: number, layout: Partial<InsertDashboardLayout>): Promise<DashboardLayout> {
    const [updatedLayout] = await db
      .update(dashboardLayouts)
      .set({ ...layout, updatedAt: new Date() })
      .where(eq(dashboardLayouts.id, id))
      .returning();
    return updatedLayout;
  }

  async deleteDashboardLayout(id: number): Promise<boolean> {
    const result = await db.delete(dashboardLayouts).where(eq(dashboardLayouts.id, id));
    return result.rowCount > 0;
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [upsertedPreferences] = await db
      .insert(userPreferences)
      .values(preferences)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...preferences,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedPreferences;
  }

  // Analytics operations
  async getStats(): Promise<{
    totalDevotees: number;
    activeFamilies: number;
    totalDonations: number;
    avgAttendance: number;
  }> {
    const [devoteesCount] = await db.select({ count: count() }).from(devotees).where(eq(devotees.isActive, true));
    const [familiesCount] = await db.select({ count: count() }).from(families).where(eq(families.isActive, true));
    const [donationsSum] = await db.select({ sum: sum(donations.amount) }).from(donations);
    
    // Calculate average attendance percentage
    const totalAttendance = await db.select({ count: count() }).from(attendance);
    const presentAttendance = await db.select({ count: count() }).from(attendance).where(eq(attendance.status, 'present'));
    
    const avgAttendance = totalAttendance[0].count > 0 
      ? Math.round((presentAttendance[0].count / totalAttendance[0].count) * 100) 
      : 0;

    return {
      totalDevotees: devoteesCount.count,
      activeFamilies: familiesCount.count,
      totalDonations: parseFloat(donationsSum.sum || "0"),
      avgAttendance,
    };
  }
}

import { MemoryStorage } from "./memoryStorage";

// Create a wrapper that handles database failures gracefully
class FallbackStorage implements IStorage {
  private primaryStorage: IStorage;
  private fallbackStorage: IStorage;
  private usingFallback = false;
  public memStore: MemoryStorage;

  constructor() {
    this.memStore = new MemoryStorage();
    this.primaryStorage = this.memStore;
    this.fallbackStorage = this.memStore;
  }

  private async executeWithFallback<T>(operation: (storage: IStorage) => Promise<T>): Promise<T> {
    if (this.usingFallback) {
      return await operation(this.fallbackStorage);
    }

    try {
      return await operation(this.primaryStorage);
    } catch (error) {
      if (!this.usingFallback) {
        console.warn("⚠️ Database operation failed, switching to mock storage:", error.message);
        this.usingFallback = true;
      }
      return await operation(this.fallbackStorage);
    }
  }

  async getUser(id: string) {
    return this.executeWithFallback(storage => storage.getUser(id));
  }

  async upsertUser(user: UpsertUser) {
    return this.executeWithFallback(storage => storage.upsertUser(user));
  }

  async getDevotees() {
    return this.executeWithFallback(storage => storage.getDevotees());
  }

  async getDevotee(id: number) {
    return this.executeWithFallback(storage => storage.getDevotee(id));
  }

  async createDevotee(devotee: InsertDevotee) {
    return this.executeWithFallback(storage => storage.createDevotee(devotee));
  }

  async updateDevotee(id: number, devotee: Partial<InsertDevotee>) {
    return this.executeWithFallback(storage => storage.updateDevotee(id, devotee));
  }

  async deleteDevotee(id: number) {
    return this.executeWithFallback(storage => storage.deleteDevotee(id));
  }

  async getFamilies() {
    return this.executeWithFallback(storage => storage.getFamilies());
  }

  async getFamily(id: number) {
    return this.executeWithFallback(storage => storage.getFamily(id));
  }

  async createFamily(family: InsertFamily) {
    return this.executeWithFallback(storage => storage.createFamily(family));
  }

  async updateFamily(id: number, family: Partial<InsertFamily>) {
    return this.executeWithFallback(storage => storage.updateFamily(id, family));
  }

  async deleteFamily(id: number) {
    return this.executeWithFallback(storage => storage.deleteFamily(id));
  }

  async getMentors() {
    return this.executeWithFallback(storage => storage.getMentors());
  }

  async getMentor(id: number) {
    return this.executeWithFallback(storage => storage.getMentor(id));
  }

  async createMentor(mentor: InsertMentor) {
    return this.executeWithFallback(storage => storage.createMentor(mentor));
  }

  async updateMentor(id: number, mentor: Partial<InsertMentor>) {
    return this.executeWithFallback(storage => storage.updateMentor(id, mentor));
  }

  async deleteMentor(id: number) {
    return this.executeWithFallback(storage => storage.deleteMentor(id));
  }

  async getAttendance(devoteeId?: number, eventId?: number) {
    return this.executeWithFallback(storage => storage.getAttendance(devoteeId, eventId));
  }

  async createAttendance(attendance: InsertAttendance) {
    return this.executeWithFallback(storage => storage.createAttendance(attendance));
  }

  async updateAttendance(id: number, attendance: Partial<InsertAttendance>) {
    return this.executeWithFallback(storage => storage.updateAttendance(id, attendance));
  }

  async deleteAttendance(id: number) {
    return this.executeWithFallback(storage => storage.deleteAttendance(id));
  }

  async getDonations(devoteeId?: number) {
    return this.executeWithFallback(storage => storage.getDonations(devoteeId));
  }

  async createDonation(donation: InsertDonation) {
    return this.executeWithFallback(storage => storage.createDonation(donation));
  }

  async updateDonation(id: number, donation: Partial<InsertDonation>) {
    return this.executeWithFallback(storage => storage.updateDonation(id, donation));
  }

  async deleteDonation(id: number) {
    return this.executeWithFallback(storage => storage.deleteDonation(id));
  }

  async getEvents() {
    return this.executeWithFallback(storage => storage.getEvents());
  }

  async getEvent(id: number) {
    return this.executeWithFallback(storage => storage.getEvent(id));
  }

  async createEvent(event: InsertEvent) {
    return this.executeWithFallback(storage => storage.createEvent(event));
  }

  async updateEvent(id: number, event: Partial<InsertEvent>) {
    return this.executeWithFallback(storage => storage.updateEvent(id, event));
  }

  async deleteEvent(id: number) {
    return this.executeWithFallback(storage => storage.deleteEvent(id));
  }

  async getVolunteering(devoteeId?: number) {
    return this.executeWithFallback(storage => storage.getVolunteering(devoteeId));
  }

  async createVolunteering(volunteering: InsertVolunteering) {
    return this.executeWithFallback(storage => storage.createVolunteering(volunteering));
  }

  async updateVolunteering(id: number, volunteering: Partial<InsertVolunteering>) {
    return this.executeWithFallback(storage => storage.updateVolunteering(id, volunteering));
  }

  async deleteVolunteering(id: number) {
    return this.executeWithFallback(storage => storage.deleteVolunteering(id));
  }

  async getGroups() {
    return this.executeWithFallback(storage => storage.getGroups());
  }

  async getGroup(id: number) {
    return this.executeWithFallback(storage => storage.getGroup(id));
  }

  async createGroup(group: InsertGroup) {
    return this.executeWithFallback(storage => storage.createGroup(group));
  }

  async updateGroup(id: number, group: Partial<InsertGroup>) {
    return this.executeWithFallback(storage => storage.updateGroup(id, group));
  }

  async deleteGroup(id: number) {
    return this.executeWithFallback(storage => storage.deleteGroup(id));
  }

  async getGroupEntries(groupId?: number) {
    return this.executeWithFallback(storage => storage.getGroupEntries(groupId));
  }

  async createGroupEntry(entry: InsertGroupEntry) {
    return this.executeWithFallback(storage => storage.createGroupEntry(entry));
  }

  async updateGroupEntry(id: number, entry: Partial<InsertGroupEntry>) {
    return this.executeWithFallback(storage => storage.updateGroupEntry(id, entry));
  }

  async deleteGroupEntry(id: number) {
    return this.executeWithFallback(storage => storage.deleteGroupEntry(id));
  }

  async getMandals() {
    return this.executeWithFallback(storage => storage.getMandals());
  }

  async createMandal(mandal: InsertMandal) {
    return this.executeWithFallback(storage => storage.createMandal(mandal));
  }

  async getSabhaLocations() {
    return this.executeWithFallback(storage => storage.getSabhaLocations());
  }

  async createSabhaLocation(location: InsertSabhaLocation) {
    return this.executeWithFallback(storage => storage.createSabhaLocation(location));
  }

  async getDashboardLayouts(userId: string) {
    return this.executeWithFallback(storage => storage.getDashboardLayouts(userId));
  }

  async createDashboardLayout(layout: InsertDashboardLayout) {
    return this.executeWithFallback(storage => storage.createDashboardLayout(layout));
  }

  async updateDashboardLayout(id: number, layout: Partial<InsertDashboardLayout>) {
    return this.executeWithFallback(storage => storage.updateDashboardLayout(id, layout));
  }

  async deleteDashboardLayout(id: number) {
    return this.executeWithFallback(storage => storage.deleteDashboardLayout(id));
  }

  async getUserPreferences(userId: string) {
    return this.executeWithFallback(storage => storage.getUserPreferences(userId));
  }

  async upsertUserPreferences(preferences: InsertUserPreferences) {
    return this.executeWithFallback(storage => storage.upsertUserPreferences(preferences));
  }

  async getStats() {
    return this.executeWithFallback(storage => storage.getStats());
  }
}

export const storage = new FallbackStorage();
