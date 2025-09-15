import {v4 as uuidv4} from 'uuid';

const departments = ['Tech', 'Analytics', 'HR', 'Marketing', 'Sales', 'Finance', 'Operations'];
const positions = ['Junior', 'Medior', 'Senior', 'Lead', 'Manager'];
const firstNames = [
  'Ayşe', 'Mehmet', 'Elif', 'Ahmet', 'Fatma', 'Mustafa', 'Zeynep', 'Ali', 'Emine', 'Hasan',
  'Hatice', 'İbrahim', 'Zeliha', 'Ömer', 'Sevgi', 'Yusuf', 'Merve', 'Osman', 'Büşra', 'Emre',
  'Seda', 'Kemal', 'Gül', 'Serkan', 'Pınar', 'Burak', 'Deniz', 'Cem', 'Aslı', 'Tolga',
  'Esra', 'Murat', 'Cansu', 'Erhan', 'Sibel', 'Onur', 'Gamze', 'Barış', 'Özge', 'Kaan'
];
const lastNames = [
  'Yılmaz', 'Demir', 'Kaya', 'Şahin', 'Çelik', 'Özkan', 'Aydın', 'Özdemir', 'Arslan', 'Doğan',
  'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özturk', 'Şen', 'Duman', 'Bakır',
  'Güneş', 'Erdoğan', 'Yıldız', 'Polat', 'Bulut', 'Demirci', 'Korkmaz', 'Çakır', 'Uysal', 'Güler'
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function generatePhoneNumber() {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const firstPart = Math.floor(Math.random() * 900) + 100;
  const secondPart = Math.floor(Math.random() * 9000) + 1000;
  return `+90 555 ${areaCode} ${firstPart.toString().slice(0,2)}${secondPart.toString().slice(0,2)}`;
}

export function generateSampleEmployees(count = 50) {
  const employees = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const dob = formatDate(getRandomDate(new Date(1980, 0, 1), new Date(2000, 11, 31)));
    const doe = formatDate(getRandomDate(new Date(2015, 0, 1), new Date(2024, 11, 31)));
    
    employees.push({
      id: uuidv4(),
      firstName,
      lastName,
      dob,
      doe,
      phone: generatePhoneNumber(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      department: getRandomItem(departments),
      position: getRandomItem(positions)
    });
  }
  
  return employees;
}

export const defaultEmployees = [
  {
    id: uuidv4(),
    firstName: 'Ayşe',
    lastName: 'Yılmaz',
    dob: '1994-05-12',
    doe: '2020-03-01',
    phone: '+90 555 111 2233',
    email: 'ayse.yilmaz@example.com',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: uuidv4(),
    firstName: 'Mehmet',
    lastName: 'Demir',
    dob: '1990-11-02',
    doe: '2019-07-15',
    phone: '+90 555 222 3344',
    email: 'mehmet.demir@example.com',
    department: 'Tech',
    position: 'Medior',
  },
  {
    id: uuidv4(),
    firstName: 'Elif',
    lastName: 'Kaya',
    dob: '1998-01-22',
    doe: '2022-09-05',
    phone: '+90 555 333 4455',
    email: 'elif.kaya@example.com',
    department: 'Tech',
    position: 'Junior',
  },
];