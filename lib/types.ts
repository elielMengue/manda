export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type Cours = {
  id: number;
  titre: string;
  description: string;
  duree: number;
  status: string;
  imageUrl: string;
  createdAt: string;
  mentorId: number;
  modules?: Module[];
};

export type Module = {
  id: number;
  titre: string;
  description: string;
  ordre: number;
  duree: number;
  coursId: number;
};

export type Lesson = {
  id: number;
  titre: string;
  textContenu: string;
  duree: number;
  type: string;
  ordre: number;
  videoUrl: string;
  moduleId: number;
};

