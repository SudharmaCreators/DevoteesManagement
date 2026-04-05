
import {
  User,
  UpsertUser,
  Devotee,
  InsertDevotee,
  Family,
  InsertFamily,
  Mentor,
  InsertMentor,
  Attendance,
  InsertAttendance,
  Donation,
  InsertDonation,
  Event,
  InsertEvent,
  Volunteering,
  InsertVolunteering,
  Group,
  InsertGroup,
  GroupEntry,
  InsertGroupEntry,
  Mandal,
  InsertMandal,
  SabhaLocation,
  InsertSabhaLocation,
  DashboardLayout,
  InsertDashboardLayout,
  UserPreferences,
  InsertUserPreferences,
} from "@shared/schema";

export class MockStorage {
  private users: User[] = [];
  private devotees: Devotee[] = [];
  private families: Family[] = [];
  private mentors: Mentor[] = [];
  private attendance: Attendance[] = [];
  private donations: Donation[] = [];
  private events: Event[] = [];
  private volunteering: Volunteering[] = [];
  private groups: Group[] = [];
  private groupEntries: GroupEntry[] = [];
  private mandals: Mandal[] = [
    { id: 1, name: "Ayodhya", hindiName: "अयोध्या", code: "AY", description: "Ayodhya Mandal", isActive: true, createdAt: new Date() },
    { id: 2, name: "Dwarka", hindiName: "द्वारका", code: "DW", description: "Dwarka Mandal", isActive: true, createdAt: new Date() },
    { id: 3, name: "Gokul Puri", hindiName: "गोकुल पुरी", code: "GP", description: "Gokul Puri Mandal", isActive: true, createdAt: new Date() },
    { id: 4, name: "Mathura", hindiName: "मथुरा", code: "MT", description: "Mathura Mandal", isActive: true, createdAt: new Date() },
    { id: 5, name: "Vrindavan", hindiName: "वृंदावन", code: "VR", description: "Vrindavan Mandal", isActive: true, createdAt: new Date() },
  ];
  private sabhaLocations: SabhaLocation[] = [
    { id: 1, name: "Main Temple Hall", address: "123 Temple Street", city: "Delhi", state: "Delhi", isActive: true, createdAt: new Date() },
    { id: 2, name: "Community Center", address: "456 Community Road", city: "Mumbai", state: "Maharashtra", isActive: true, createdAt: new Date() },
    { id: 3, name: "Satsang Bhawan", address: "789 Satsang Lane", city: "Ahmedabad", state: "Gujarat", isActive: true, createdAt: new Date() },
  ];
  private dashboardLayouts: DashboardLayout[] = [];
  private userPreferences: UserPreferences[] = [];
  private nextId = 1;

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.find(user => user.id === userData.id);
    if (existing) {
      Object.assign(existing, userData, { updatedAt: new Date() });
      return existing;
    }
    const newUser = {
      ...userData,
      role: userData.role || "user",
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser as User);
    return newUser as User;
  }

  // Devotee operations
  async getDevotees(): Promise<Devotee[]> {
    return [...this.devotees].sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getDevotee(id: number): Promise<Devotee | undefined> {
    return this.devotees.find(devotee => devotee.id === id);
  }

  async createDevotee(devotee: InsertDevotee): Promise<Devotee> {
    const newDevotee = {
      ...devotee,
      id: this.nextId++,
      isActive: devotee.isActive !== undefined ? devotee.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.devotees.push(newDevotee as Devotee);
    return newDevotee as Devotee;
  }

  async updateDevotee(id: number, devotee: Partial<InsertDevotee>): Promise<Devotee> {
    const existing = this.devotees.find(d => d.id === id);
    if (!existing) throw new Error("Devotee not found");
    Object.assign(existing, devotee, { updatedAt: new Date() });
    return existing;
  }

  async deleteDevotee(id: number): Promise<boolean> {
    const index = this.devotees.findIndex(d => d.id === id);
    if (index === -1) return false;
    this.devotees.splice(index, 1);
    return true;
  }

  // Family operations
  async getFamilies(): Promise<Family[]> {
    return [...this.families].sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getFamily(id: number): Promise<Family | undefined> {
    return this.families.find(family => family.id === id);
  }

  async createFamily(family: InsertFamily): Promise<Family> {
    const newFamily = {
      ...family,
      id: this.nextId++,
      isActive: family.isActive !== undefined ? family.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.families.push(newFamily as Family);
    return newFamily as Family;
  }

  async updateFamily(id: number, family: Partial<InsertFamily>): Promise<Family> {
    const existing = this.families.find(f => f.id === id);
    if (!existing) throw new Error("Family not found");
    Object.assign(existing, family, { updatedAt: new Date() });
    return existing;
  }

  async deleteFamily(id: number): Promise<boolean> {
    const index = this.families.findIndex(f => f.id === id);
    if (index === -1) return false;
    this.families.splice(index, 1);
    return true;
  }

  // Mentor operations
  async getMentors(): Promise<Mentor[]> {
    return [...this.mentors].sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getMentor(id: number): Promise<Mentor | undefined> {
    return this.mentors.find(mentor => mentor.id === id);
  }

  async createMentor(mentor: InsertMentor): Promise<Mentor> {
    const newMentor = {
      ...mentor,
      id: this.nextId++,
      isActive: mentor.isActive !== undefined ? mentor.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mentors.push(newMentor as Mentor);
    return newMentor as Mentor;
  }

  async updateMentor(id: number, mentor: Partial<InsertMentor>): Promise<Mentor> {
    const existing = this.mentors.find(m => m.id === id);
    if (!existing) throw new Error("Mentor not found");
    Object.assign(existing, mentor, { updatedAt: new Date() });
    return existing;
  }

  async deleteMentor(id: number): Promise<boolean> {
    const index = this.mentors.findIndex(m => m.id === id);
    if (index === -1) return false;
    this.mentors.splice(index, 1);
    return true;
  }

  // Attendance operations
  async getAttendance(devoteeId?: number, eventId?: number): Promise<Attendance[]> {
    let filtered = this.attendance;
    if (devoteeId) filtered = filtered.filter(a => a.devoteeId === devoteeId);
    if (eventId) filtered = filtered.filter(a => a.eventId === eventId);
    return [...filtered].sort((a, b) => b.attendanceDate.getTime() - a.attendanceDate.getTime());
  }

  async createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const newAttendance = {
      ...attendance,
      id: this.nextId++,
      createdAt: new Date(),
    };
    this.attendance.push(newAttendance as Attendance);
    return newAttendance as Attendance;
  }

  async updateAttendance(id: number, attendance: Partial<InsertAttendance>): Promise<Attendance> {
    const existing = this.attendance.find(a => a.id === id);
    if (!existing) throw new Error("Attendance not found");
    Object.assign(existing, attendance);
    return existing;
  }

  async deleteAttendance(id: number): Promise<boolean> {
    const index = this.attendance.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.attendance.splice(index, 1);
    return true;
  }

  // Donation operations
  async getDonations(devoteeId?: number): Promise<Donation[]> {
    let filtered = this.donations;
    if (devoteeId) filtered = filtered.filter(d => d.devoteeId === devoteeId);
    return [...filtered].sort((a, b) => b.donationDate.getTime() - a.donationDate.getTime());
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const newDonation = {
      ...donation,
      id: this.nextId++,
      createdAt: new Date(),
    };
    this.donations.push(newDonation as Donation);
    return newDonation as Donation;
  }

  async updateDonation(id: number, donation: Partial<InsertDonation>): Promise<Donation> {
    const existing = this.donations.find(d => d.id === id);
    if (!existing) throw new Error("Donation not found");
    Object.assign(existing, donation);
    return existing;
  }

  async deleteDonation(id: number): Promise<boolean> {
    const index = this.donations.findIndex(d => d.id === id);
    if (index === -1) return false;
    this.donations.splice(index, 1);
    return true;
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return [...this.events].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.find(event => event.id === id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const newEvent = {
      ...event,
      id: this.nextId++,
      isActive: event.isActive !== undefined ? event.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.push(newEvent as Event);
    return newEvent as Event;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const existing = this.events.find(e => e.id === id);
    if (!existing) throw new Error("Event not found");
    Object.assign(existing, event, { updatedAt: new Date() });
    return existing;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return false;
    this.events.splice(index, 1);
    return true;
  }

  // Volunteering operations
  async getVolunteering(devoteeId?: number): Promise<Volunteering[]> {
    let filtered = this.volunteering;
    if (devoteeId) filtered = filtered.filter(v => v.devoteeId === devoteeId);
    return [...filtered].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  async createVolunteering(volunteering: InsertVolunteering): Promise<Volunteering> {
    const newVolunteering = {
      ...volunteering,
      id: this.nextId++,
      createdAt: new Date(),
    };
    this.volunteering.push(newVolunteering as Volunteering);
    return newVolunteering as Volunteering;
  }

  async updateVolunteering(id: number, volunteering: Partial<InsertVolunteering>): Promise<Volunteering> {
    const existing = this.volunteering.find(v => v.id === id);
    if (!existing) throw new Error("Volunteering not found");
    Object.assign(existing, volunteering);
    return existing;
  }

  async deleteVolunteering(id: number): Promise<boolean> {
    const index = this.volunteering.findIndex(v => v.id === id);
    if (index === -1) return false;
    this.volunteering.splice(index, 1);
    return true;
  }

  // Group operations
  async getGroups(): Promise<Group[]> {
    return [...this.groups].sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getGroup(id: number): Promise<Group | undefined> {
    return this.groups.find(group => group.id === id);
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const newGroup = {
      ...group,
      id: this.nextId++,
      currentMembers: group.currentMembers || 0,
      isActive: group.isActive !== undefined ? group.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.groups.push(newGroup as Group);
    return newGroup as Group;
  }

  async updateGroup(id: number, group: Partial<InsertGroup>): Promise<Group> {
    const existing = this.groups.find(g => g.id === id);
    if (!existing) throw new Error("Group not found");
    Object.assign(existing, group, { updatedAt: new Date() });
    return existing;
  }

  async deleteGroup(id: number): Promise<boolean> {
    const index = this.groups.findIndex(g => g.id === id);
    if (index === -1) return false;
    this.groups.splice(index, 1);
    return true;
  }

  // Group entries operations
  async getGroupEntries(groupId?: number): Promise<GroupEntry[]> {
    let filtered = this.groupEntries;
    if (groupId) filtered = filtered.filter(e => e.groupId === groupId);
    return [...filtered].sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createGroupEntry(entry: InsertGroupEntry): Promise<GroupEntry> {
    const newEntry = {
      ...entry,
      id: this.nextId++,
      isActive: entry.isActive !== undefined ? entry.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.groupEntries.push(newEntry as GroupEntry);
    return newEntry as GroupEntry;
  }

  async updateGroupEntry(id: number, entry: Partial<InsertGroupEntry>): Promise<GroupEntry> {
    const existing = this.groupEntries.find(e => e.id === id);
    if (!existing) throw new Error("Group entry not found");
    Object.assign(existing, entry, { updatedAt: new Date() });
    return existing;
  }

  async deleteGroupEntry(id: number): Promise<boolean> {
    const index = this.groupEntries.findIndex(e => e.id === id);
    if (index === -1) return false;
    this.groupEntries.splice(index, 1);
    return true;
  }

  // Mandal operations
  async getMandals(): Promise<Mandal[]> {
    return this.mandals.filter(m => m.isActive);
  }

  async createMandal(mandal: InsertMandal): Promise<Mandal> {
    const newMandal = {
      ...mandal,
      id: this.nextId++,
      isActive: mandal.isActive !== undefined ? mandal.isActive : true,
      createdAt: new Date(),
    };
    this.mandals.push(newMandal as Mandal);
    return newMandal as Mandal;
  }

  // Sabha location operations
  async getSabhaLocations(): Promise<SabhaLocation[]> {
    return this.sabhaLocations.filter(s => s.isActive);
  }

  async createSabhaLocation(location: InsertSabhaLocation): Promise<SabhaLocation> {
    const newLocation = {
      ...location,
      id: this.nextId++,
      isActive: location.isActive !== undefined ? location.isActive : true,
      createdAt: new Date(),
    };
    this.sabhaLocations.push(newLocation as SabhaLocation);
    return newLocation as SabhaLocation;
  }

  // Dashboard operations
  async getDashboardLayouts(userId: string): Promise<DashboardLayout[]> {
    return this.dashboardLayouts.filter(layout => layout.userId === userId);
  }

  async createDashboardLayout(layout: InsertDashboardLayout): Promise<DashboardLayout> {
    const newLayout = {
      ...layout,
      id: this.nextId++,
      isDefault: layout.isDefault || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.dashboardLayouts.push(newLayout as DashboardLayout);
    return newLayout as DashboardLayout;
  }

  async updateDashboardLayout(id: number, layout: Partial<InsertDashboardLayout>): Promise<DashboardLayout> {
    const existing = this.dashboardLayouts.find(l => l.id === id);
    if (!existing) throw new Error("Dashboard layout not found");
    Object.assign(existing, layout, { updatedAt: new Date() });
    return existing;
  }

  async deleteDashboardLayout(id: number): Promise<boolean> {
    const index = this.dashboardLayouts.findIndex(l => l.id === id);
    if (index === -1) return false;
    this.dashboardLayouts.splice(index, 1);
    return true;
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return this.userPreferences.find(pref => pref.userId === userId);
  }

  async upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const existing = this.userPreferences.find(pref => pref.userId === preferences.userId);
    if (existing) {
      Object.assign(existing, preferences, { updatedAt: new Date() });
      return existing;
    }
    const newPreferences = {
      ...preferences,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userPreferences.push(newPreferences as UserPreferences);
    return newPreferences as UserPreferences;
  }

  // Analytics operations
  async getStats(): Promise<{
    totalDevotees: number;
    activeFamilies: number;
    totalDonations: number;
    avgAttendance: number;
  }> {
    const totalDevotees = this.devotees.filter(d => d.isActive).length;
    const activeFamilies = this.families.filter(f => f.isActive).length;
    const totalDonations = this.donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
    
    const totalAttendanceRecords = this.attendance.length;
    const presentAttendance = this.attendance.filter(a => a.status === 'present').length;
    const avgAttendance = totalAttendanceRecords > 0 
      ? Math.round((presentAttendance / totalAttendanceRecords) * 100) 
      : 0;

    return {
      totalDevotees,
      activeFamilies,
      totalDonations,
      avgAttendance,
    };
  }
}
