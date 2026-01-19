import { University, Major, Cutoff, Tuition } from './types';

export const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Huế'];
export const GROUPS = ['CNTT', 'Kinh tế', 'Y dược', 'Luật', 'Sư phạm', 'Kỹ thuật'];
export const COMBINATIONS = ['A00', 'A01', 'B00', 'C00', 'D01', 'D07'];

export const MOCK_UNIVERSITIES: University[] = [
  {
    id: 'hust',
    code: 'BKA',
    name: 'Đại học Bách khoa Hà Nội',
    city: 'Hà Nội',
    logo: 'https://picsum.photos/id/1/200/200',
    type: 'Public',
    description: 'Trường đại học kỹ thuật hàng đầu tại Việt Nam, thành viên của Bộ Giáo dục và Đào tạo.',
    website: 'https://hust.edu.vn',
    established: 1956
  },
  {
    id: 'neu',
    code: 'KHA',
    name: 'Đại học Kinh tế Quốc dân',
    city: 'Hà Nội',
    logo: 'https://picsum.photos/id/2/200/200',
    type: 'Public',
    description: 'Trường đại học trọng điểm quốc gia, trường đầu ngành về khối ngành kinh tế và quản lý.',
    website: 'https://neu.edu.vn',
    established: 1956
  },
  {
    id: 'ftu',
    code: 'NTH',
    name: 'Đại học Ngoại thương',
    city: 'Hà Nội',
    logo: 'https://picsum.photos/id/3/200/200',
    type: 'Public',
    description: 'Chuyên đào tạo về kinh tế đối ngoại, kinh doanh quốc tế và quản trị kinh doanh.',
    website: 'https://ftu.edu.vn',
    established: 1960
  },
  {
    id: 'ueh',
    code: 'KSA',
    name: 'Đại học Kinh tế TP.HCM',
    city: 'TP. Hồ Chí Minh',
    logo: 'https://picsum.photos/id/4/200/200',
    type: 'Public',
    description: 'Đại học đa ngành với thế mạnh về đào tạo kinh tế, kinh doanh và luật.',
    website: 'https://ueh.edu.vn',
    established: 1976
  },
  {
    id: 'uit',
    code: 'QSC',
    name: 'Đại học Công nghệ Thông tin - ĐHQG TP.HCM',
    city: 'TP. Hồ Chí Minh',
    logo: 'https://picsum.photos/id/5/200/200',
    type: 'Public',
    description: 'Trường đại học chuyên ngành về công nghệ thông tin và truyền thông.',
    website: 'https://uit.edu.vn',
    established: 2006
  }
];

export const MOCK_MAJORS: Major[] = [
  { id: 'm1', universityId: 'hust', code: 'IT1', name: 'Khoa học Máy tính', group: 'CNTT', description: 'Đào tạo kỹ sư KHMT chất lượng cao.' },
  { id: 'm2', universityId: 'hust', code: 'EE1', name: 'Kỹ thuật Điện', group: 'Kỹ thuật', description: 'Đào tạo kỹ sư điện, hệ thống điện.' },
  { id: 'm3', universityId: 'neu', code: 'MKT', name: 'Marketing', group: 'Kinh tế', description: 'Chuyên ngành Marketing số và truyền thông.' },
  { id: 'm4', universityId: 'neu', code: 'ACC', name: 'Kế toán', group: 'Kinh tế', description: 'Kế toán kiểm toán chuẩn quốc tế.' },
  { id: 'm5', universityId: 'uit', code: 'CS', name: 'Khoa học Máy tính', group: 'CNTT', description: 'Chương trình tiên tiến KHMT.' },
  { id: 'm6', universityId: 'ftu', code: 'KTE', name: 'Kinh tế đối ngoại', group: 'Kinh tế', description: 'Ngành hot nhất FTU.' },
];

export const MOCK_CUTOFFS: Cutoff[] = [
  { majorId: 'm1', year: 2024, method: 'THPT', score: 29.42, scale: 30, combinations: ['A00', 'A01'] },
  { majorId: 'm1', year: 2023, method: 'THPT', score: 29.35, scale: 30, combinations: ['A00', 'A01'] },
  { majorId: 'm1', year: 2024, method: 'DGNL', score: 85, scale: 100, combinations: ['Thinking'] },
  { majorId: 'm3', year: 2024, method: 'THPT', score: 27.5, scale: 30, combinations: ['A00', 'D01'] },
  { majorId: 'm3', year: 2023, method: 'THPT', score: 27.2, scale: 30, combinations: ['A00', 'D01'] },
  { majorId: 'm6', year: 2024, method: 'THPT', score: 28.5, scale: 30, combinations: ['A01', 'D01'] },
  { majorId: 'm5', year: 2024, method: 'THPT', score: 28.1, scale: 30, combinations: ['A00', 'A01'] },
];

export const MOCK_TUITION: Tuition[] = [
  { majorId: 'm1', year: '2024-2025', min: 28, max: 35, unit: 'năm' },
  { majorId: 'm3', year: '2024-2025', min: 20, max: 25, unit: 'năm' },
  { majorId: 'm6', year: '2024-2025', min: 25, max: 60, unit: 'năm' },
  { majorId: 'm5', year: '2024-2025', min: 30, max: 40, unit: 'năm' },
];
