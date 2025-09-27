import {
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
import { type IStorage } from "./storage";

// In-memory storage implementation
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private devotees: Map<number, Devotee> = new Map();
  private families: Map<number, Family> = new Map();
  private mentors: Map<number, Mentor> = new Map();
  private attendance: Map<number, Attendance> = new Map();
  private donations: Map<number, Donation> = new Map();
  private events: Map<number, Event> = new Map();
  private volunteering: Map<number, Volunteering> = new Map();
  private groups: Map<number, Group> = new Map();
  private groupEntries: Map<number, GroupEntry> = new Map();
  private mandals: Map<number, Mandal> = new Map();
  private sabhaLocations: Map<number, SabhaLocation> = new Map();
  private dashboardLayouts: Map<number, DashboardLayout> = new Map();
  private userPreferences: Map<string, UserPreferences> = new Map();

  // Counter for auto-incrementing IDs
  private counters = {
    devotees: 1,
    families: 1,
    mentors: 1,
    attendance: 1,
    donations: 1,
    events: 1,
    volunteering: 1,
    groups: 1,
    groupEntries: 1,
    mandals: 1,
    sabhaLocations: 1,
    dashboardLayouts: 1,
  };

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add some sample data for demonstration
    const now = new Date();
    
    // Sample groups
    const sampleGroups: Group[] = [
      {
        id: 1,
        groupName: "Youth Group",
        description: "Group for young devotees",
        mentorId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        groupName: "Family Circle",
        description: "Family devotional activities",
        mentorId: null,
        createdAt: now,
        updatedAt: now,
      },
    ];

    sampleGroups.forEach(group => {
      this.groups.set(group.id, group);
      this.counters.groups = Math.max(this.counters.groups, group.id + 1);
    });

    // Sample events
    const sampleEvents: Event[] = [
      {
        id: 1,
        title: "Weekly Sabha",
        description: "Regular weekly devotional gathering",
        startDate: now,
        location: "Main Hall",
        maxAttendees: 100,
        createdAt: now,
        updatedAt: now,
      },
    ];

    sampleEvents.forEach(event => {
      this.events.set(event.id, event);
      this.counters.events = Math.max(this.counters.events, event.id + 1);
    });

    // Sample mandals
    const sampleMandals: Mandal[] = [
      {
        id: 1,
        name: "Central Mandal",
        code: "CM001",
        contactPerson: "Admin",
        contactPhone: "123-456-7890",
        createdAt: now,
        updatedAt: now,
      },
    ];

    sampleMandals.forEach(mandal => {
      this.mandals.set(mandal.id, mandal);
      this.counters.mandals = Math.max(this.counters.mandals, mandal.id + 1);
    });

    // Sample sabha locations
    const sampleLocations: SabhaLocation[] = [
      {
        id: 1,
        name: "Main Sabha Hall",
        address: "123 Main Street",
        zipCode: "12345",
        facilities: ["Audio System", "Parking"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    sampleLocations.forEach(location => {
      this.sabhaLocations.set(location.id, location);
      this.counters.sabhaLocations = Math.max(this.counters.sabhaLocations, location.id + 1);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const now = new Date();
    const user: User = {
      id: userData.id,
      role: userData.role || "user",
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      isActive: userData.isActive ?? true,
      createdAt: this.users.get(userData.id)?.createdAt || now,
      updatedAt: now,
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Devotee operations
  async getDevotees(): Promise<Devotee[]> {
    return Array.from(this.devotees.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getDevotee(id: number): Promise<Devotee | undefined> {
    return this.devotees.get(id);
  }

  async createDevotee(devoteeData: InsertDevotee): Promise<Devotee> {
    const now = new Date();
    const id = this.counters.devotees++;
    const devotee: Devotee = {
      id,
      devoteeId: devoteeData.devoteeId,
      firstName: devoteeData.firstName,
      lastName: devoteeData.lastName,
      email: devoteeData.email || null,
      phone: devoteeData.phone || null,
      whatsappNumber: devoteeData.whatsappNumber || null,
      dateOfBirth: devoteeData.dateOfBirth || null,
      gender: devoteeData.gender || null,
      address: devoteeData.address || null,
      city: devoteeData.city || null,
      state: devoteeData.state || null,
      pincode: devoteeData.pincode || null,
      country: devoteeData.country || null,
      occupation: devoteeData.occupation || null,
      spiritualLevel: devoteeData.spiritualLevel || null,
      joinDate: devoteeData.joinDate || null,
      mentorId: devoteeData.mentorId || null,
      familyId: devoteeData.familyId || null,
      profileImage: devoteeData.profileImage || null,
      notes: devoteeData.notes || null,
      specialSkills: devoteeData.specialSkills || null,
      previousExperience: devoteeData.previousExperience || null,
      emergencyContact: devoteeData.emergencyContact || null,
      emergencyPhone: devoteeData.emergencyPhone || null,
      medicalConditions: devoteeData.medicalConditions || null,
      dietaryPreferences: devoteeData.dietaryPreferences || null,
      isActive: devoteeData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.devotees.set(id, devotee);
    return devotee;
  }

  async updateDevotee(id: number, devoteeData: Partial<InsertDevotee>): Promise<Devotee> {
    const existingDevotee = this.devotees.get(id);
    if (!existingDevotee) {
      throw new Error(`Devotee with id ${id} not found`);
    }
    const updatedDevotee: Devotee = {
      ...existingDevotee,
      ...devoteeData,
      updatedAt: new Date(),
    };
    this.devotees.set(id, updatedDevotee);
    return updatedDevotee;
  }

  async deleteDevotee(id: number): Promise<boolean> {
    return this.devotees.delete(id);
  }

  // Family operations
  async getFamilies(): Promise<Family[]> {
    return Array.from(this.families.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getFamily(id: number): Promise<Family | undefined> {
    return this.families.get(id);
  }

  async createFamily(familyData: InsertFamily): Promise<Family> {
    const now = new Date();
    const id = this.counters.families++;
    const family: Family = {
      id,
      familyName: familyData.familyName,
      headOfFamily: familyData.headOfFamily || null,
      address: familyData.address || null,
      city: familyData.city || null,
      state: familyData.state || null,
      pincode: familyData.pincode || null,
      country: familyData.country || null,
      phone: familyData.phone || null,
      email: familyData.email || null,
      totalMembers: familyData.totalMembers || null,
      emergencyContact: familyData.emergencyContact || null,
      notes: familyData.notes || null,
      isActive: familyData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.families.set(id, family);
    return family;
  }

  async updateFamily(id: number, familyData: Partial<InsertFamily>): Promise<Family> {
    const existingFamily = this.families.get(id);
    if (!existingFamily) {
      throw new Error(`Family with id ${id} not found`);
    }
    const updatedFamily: Family = {
      ...existingFamily,
      ...familyData,
      updatedAt: new Date(),
    };
    this.families.set(id, updatedFamily);
    return updatedFamily;
  }

  async deleteFamily(id: number): Promise<boolean> {
    return this.families.delete(id);
  }

  // Mentor operations
  async getMentors(): Promise<Mentor[]> {
    return Array.from(this.mentors.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getMentor(id: number): Promise<Mentor | undefined> {
    return this.mentors.get(id);
  }

  async createMentor(mentorData: InsertMentor): Promise<Mentor> {
    const now = new Date();
    const id = this.counters.mentors++;
    const mentor: Mentor = {
      id,
      devoteeId: mentorData.devoteeId,
      specialization: mentorData.specialization || null,
      experience: mentorData.experience || null,
      qualifications: mentorData.qualifications || null,
      availableHours: mentorData.availableHours || null,
      contactPreference: mentorData.contactPreference || null,
      maxMentees: mentorData.maxMentees || null,
      currentMentees: mentorData.currentMentees || null,
      isActive: mentorData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.mentors.set(id, mentor);
    return mentor;
  }

  async updateMentor(id: number, mentorData: Partial<InsertMentor>): Promise<Mentor> {
    const existingMentor = this.mentors.get(id);
    if (!existingMentor) {
      throw new Error(`Mentor with id ${id} not found`);
    }
    const updatedMentor: Mentor = {
      ...existingMentor,
      ...mentorData,
      updatedAt: new Date(),
    };
    this.mentors.set(id, updatedMentor);
    return updatedMentor;
  }

  async deleteMentor(id: number): Promise<boolean> {
    return this.mentors.delete(id);
  }

  // Attendance operations
  async getAttendance(devoteeId?: number, eventId?: number): Promise<Attendance[]> {
    let result = Array.from(this.attendance.values());
    
    if (devoteeId) {
      result = result.filter(a => a.devoteeId === devoteeId);
    }
    
    if (eventId) {
      result = result.filter(a => a.eventId === eventId);
    }
    
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const now = new Date();
    const id = this.counters.attendance++;
    const attendance: Attendance = {
      id,
      ...attendanceData,
      createdAt: now,
      updatedAt: now,
    };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, attendanceData: Partial<InsertAttendance>): Promise<Attendance> {
    const existingAttendance = this.attendance.get(id);
    if (!existingAttendance) {
      throw new Error(`Attendance record with id ${id} not found`);
    }
    const updatedAttendance: Attendance = {
      ...existingAttendance,
      ...attendanceData,
      updatedAt: new Date(),
    };
    this.attendance.set(id, updatedAttendance);
    return updatedAttendance;
  }

  async deleteAttendance(id: number): Promise<boolean> {
    return this.attendance.delete(id);
  }

  // Donation operations
  async getDonations(devoteeId?: number): Promise<Donation[]> {
    let result = Array.from(this.donations.values());
    
    if (devoteeId) {
      result = result.filter(d => d.devoteeId === devoteeId);
    }
    
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createDonation(donationData: InsertDonation): Promise<Donation> {
    const now = new Date();
    const id = this.counters.donations++;
    const donation: Donation = {
      id,
      ...donationData,
      createdAt: now,
      updatedAt: now,
    };
    this.donations.set(id, donation);
    return donation;
  }

  async updateDonation(id: number, donationData: Partial<InsertDonation>): Promise<Donation> {
    const existingDonation = this.donations.get(id);
    if (!existingDonation) {
      throw new Error(`Donation with id ${id} not found`);
    }
    const updatedDonation: Donation = {
      ...existingDonation,
      ...donationData,
      updatedAt: new Date(),
    };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }

  async deleteDonation(id: number): Promise<boolean> {
    return this.donations.delete(id);
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const now = new Date();
    const id = this.counters.events++;
    const event: Event = {
      id,
      title: eventData.title,
      description: eventData.description || null,
      eventType: eventData.eventType,
      location: eventData.location || null,
      startDate: eventData.startDate,
      endDate: eventData.endDate || null,
      startTime: eventData.startTime || null,
      endTime: eventData.endTime || null,
      capacity: eventData.capacity || null,
      registrationRequired: eventData.registrationRequired || false,
      registrationDeadline: eventData.registrationDeadline || null,
      cost: eventData.cost || null,
      status: eventData.status || "planned",
      createdBy: eventData.createdBy || null,
      isActive: eventData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) {
      throw new Error(`Event with id ${id} not found`);
    }
    const updatedEvent: Event = {
      ...existingEvent,
      ...eventData,
      updatedAt: new Date(),
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Volunteering operations
  async getVolunteering(devoteeId?: number): Promise<Volunteering[]> {
    let result = Array.from(this.volunteering.values());
    
    if (devoteeId) {
      result = result.filter(v => v.devoteeId === devoteeId);
    }
    
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createVolunteering(volunteeringData: InsertVolunteering): Promise<Volunteering> {
    const now = new Date();
    const id = this.counters.volunteering++;
    const volunteering: Volunteering = {
      id,
      ...volunteeringData,
      createdAt: now,
      updatedAt: now,
    };
    this.volunteering.set(id, volunteering);
    return volunteering;
  }

  async updateVolunteering(id: number, volunteeringData: Partial<InsertVolunteering>): Promise<Volunteering> {
    const existingVolunteering = this.volunteering.get(id);
    if (!existingVolunteering) {
      throw new Error(`Volunteering record with id ${id} not found`);
    }
    const updatedVolunteering: Volunteering = {
      ...existingVolunteering,
      ...volunteeringData,
      updatedAt: new Date(),
    };
    this.volunteering.set(id, updatedVolunteering);
    return updatedVolunteering;
  }

  async deleteVolunteering(id: number): Promise<boolean> {
    return this.volunteering.delete(id);
  }

  // Group operations
  async getGroups(): Promise<Group[]> {
    return Array.from(this.groups.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getGroup(id: number): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async createGroup(groupData: InsertGroup): Promise<Group> {
    const now = new Date();
    const id = this.counters.groups++;
    const group: Group = {
      id,
      groupName: groupData.groupName,
      description: groupData.description || null,
      groupType: groupData.groupType,
      capacity: groupData.capacity || null,
      currentMembers: groupData.currentMembers || 0,
      location: groupData.location || null,
      meetingSchedule: groupData.meetingSchedule || null,
      leaderId: groupData.leaderId || null,
      requirements: groupData.requirements || null,
      customFields: groupData.customFields || null,
      createdBy: groupData.createdBy || null,
      isActive: groupData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.groups.set(id, group);
    return group;
  }

  async updateGroup(id: number, groupData: Partial<InsertGroup>): Promise<Group> {
    const existingGroup = this.groups.get(id);
    if (!existingGroup) {
      throw new Error(`Group with id ${id} not found`);
    }
    const updatedGroup: Group = {
      ...existingGroup,
      ...groupData,
      updatedAt: new Date(),
    };
    this.groups.set(id, updatedGroup);
    return updatedGroup;
  }

  async deleteGroup(id: number): Promise<boolean> {
    return this.groups.delete(id);
  }

  // Group entries operations
  async getGroupEntries(groupId?: number): Promise<GroupEntry[]> {
    let result = Array.from(this.groupEntries.values());
    
    if (groupId) {
      result = result.filter(ge => ge.groupId === groupId);
    }
    
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createGroupEntry(entryData: InsertGroupEntry): Promise<GroupEntry> {
    const now = new Date();
    const id = this.counters.groupEntries++;
    const entry: GroupEntry = {
      id,
      ...entryData,
      createdAt: now,
      updatedAt: now,
    };
    this.groupEntries.set(id, entry);
    return entry;
  }

  async updateGroupEntry(id: number, entryData: Partial<InsertGroupEntry>): Promise<GroupEntry> {
    const existingEntry = this.groupEntries.get(id);
    if (!existingEntry) {
      throw new Error(`Group entry with id ${id} not found`);
    }
    const updatedEntry: GroupEntry = {
      ...existingEntry,
      ...entryData,
      updatedAt: new Date(),
    };
    this.groupEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteGroupEntry(id: number): Promise<boolean> {
    return this.groupEntries.delete(id);
  }

  // Mandal operations
  async getMandals(): Promise<Mandal[]> {
    return Array.from(this.mandals.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createMandal(mandalData: InsertMandal): Promise<Mandal> {
    const now = new Date();
    const id = this.counters.mandals++;
    const mandal: Mandal = {
      id,
      ...mandalData,
      createdAt: now,
      updatedAt: now,
    };
    this.mandals.set(id, mandal);
    return mandal;
  }

  // Sabha location operations
  async getSabhaLocations(): Promise<SabhaLocation[]> {
    return Array.from(this.sabhaLocations.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createSabhaLocation(locationData: InsertSabhaLocation): Promise<SabhaLocation> {
    const now = new Date();
    const id = this.counters.sabhaLocations++;
    const location: SabhaLocation = {
      id,
      ...locationData,
      createdAt: now,
      updatedAt: now,
    };
    this.sabhaLocations.set(id, location);
    return location;
  }

  // Dashboard operations
  async getDashboardLayouts(userId: string): Promise<DashboardLayout[]> {
    return Array.from(this.dashboardLayouts.values())
      .filter(layout => layout.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createDashboardLayout(layoutData: InsertDashboardLayout): Promise<DashboardLayout> {
    const now = new Date();
    const id = this.counters.dashboardLayouts++;
    const layout: DashboardLayout = {
      id,
      ...layoutData,
      createdAt: now,
      updatedAt: now,
    };
    this.dashboardLayouts.set(id, layout);
    return layout;
  }

  async updateDashboardLayout(id: number, layoutData: Partial<InsertDashboardLayout>): Promise<DashboardLayout> {
    const existingLayout = this.dashboardLayouts.get(id);
    if (!existingLayout) {
      throw new Error(`Dashboard layout with id ${id} not found`);
    }
    const updatedLayout: DashboardLayout = {
      ...existingLayout,
      ...layoutData,
      updatedAt: new Date(),
    };
    this.dashboardLayouts.set(id, updatedLayout);
    return updatedLayout;
  }

  async deleteDashboardLayout(id: number): Promise<boolean> {
    return this.dashboardLayouts.delete(id);
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return this.userPreferences.get(userId);
  }

  async upsertUserPreferences(preferencesData: InsertUserPreferences): Promise<UserPreferences> {
    const now = new Date();
    const preferences: UserPreferences = {
      ...preferencesData,
      createdAt: this.userPreferences.get(preferencesData.userId)?.createdAt || now,
      updatedAt: now,
    };
    this.userPreferences.set(preferencesData.userId, preferences);
    return preferences;
  }

  // Analytics operations
  async getStats(): Promise<{
    totalDevotees: number;
    activeFamilies: number;
    totalDonations: number;
    avgAttendance: number;
  }> {
    const totalDevotees = this.devotees.size;
    const activeFamilies = this.families.size;
    
    const donations = Array.from(this.donations.values());
    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
    
    const attendanceRecords = Array.from(this.attendance.values());
    const avgAttendance = attendanceRecords.length > 0 
      ? attendanceRecords.length / Math.max(this.events.size, 1) 
      : 0;

    return {
      totalDevotees,
      activeFamilies,
      totalDonations,
      avgAttendance: Math.round(avgAttendance * 100) / 100,
    };
  }
}