const translations = {
  tr: {
    employees: 'Çalışanlar',
    add: 'Ekle',
    editEmployee: 'Çalışanı Düzenle',
    addEmployee: 'Çalışan Ekle',
    firstName: 'Ad',
    lastName: 'Soyad',
    dateOfEmployment: 'İşe Başlama Tarihi',
    dateOfBirth: 'Doğum Tarihi',
    doe: 'İşe Başlama',
    dob: 'Doğum Tarihi',
    phone: 'Telefon',
    email: 'E-posta',
    department: 'Departman',
    position: 'Pozisyon',
    save: 'Kaydet',
    cancel: 'İptal',
    pleaseSelect: 'Lütfen Seçiniz',
    analytics: 'Analitik',
    tech: 'Teknoloji',
    hr: 'İnsan Kaynakları',
    intern: 'Stajyer',
    junior: 'Junior',
    medior: 'Medior',
    senior: 'Senior',
    lead: 'Lead',
    invalidEmail: 'Geçersiz e-posta adresi',
    uniqueEmail: 'Bu e-posta adresi zaten kullanılıyor',
    invalidPhone: 'Geçersiz telefon numarası',
    uniquePhone: 'Bu telefon numarası zaten kullanılıyor',
    ageError: 'Yaş 18\'den küçük olamaz',
    dateOrder: 'İşe başlama tarihi doğum tarihinden sonra olmalı',
    confirmUpdate: 'Değişiklikleri kaydetmek istediğinizden emin misiniz?',
    confirmDelete: 'Silmek istediğinizden emin misiniz?',
    confirmDeleteEmployee: 'çalışanını silmek istediğinizden emin misiniz?',
    employeeList: 'Çalışan Listesi',
    table: 'Tablo',
    list: 'Liste',
    noResults: 'Sonuç bulunamadı',
    edit: 'Düzenle',
    del: 'Sil',
    firstNameLabel: 'Ad',
    lastNameLabel: 'Soyad',
    dateOfEmploymentLabel: 'İşe Başlama',
    dateOfBirthLabel: 'Doğum Tarihi',
    phoneLabel: 'Telefon',
    emailLabel: 'E-posta',
    departmentLabel: 'Departman',
    positionLabel: 'Pozisyon',
    search: 'Ara',
    searchPlaceholder: 'Ad, soyad, e-posta, departman veya pozisyon ara...'
  },
  
  en: {
    employees: 'Employees',
    add: 'Add',
    editEmployee: 'Edit Employee',
    addEmployee: 'Add Employee',
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfEmployment: 'Date of Employment',
    dateOfBirth: 'Date of Birth',
    doe: 'Date of Employment',
    dob: 'Date of Birth',
    phone: 'Phone',
    email: 'Email',
    department: 'Department',
    position: 'Position',
    save: 'Save',
    cancel: 'Cancel',
    pleaseSelect: 'Please Select',
    analytics: 'Analytics',
    tech: 'Technology',
    hr: 'Human Resources',
    intern: 'Intern',
    junior: 'Junior',
    medior: 'Medior',
    senior: 'Senior',
    lead: 'Lead',
    invalidEmail: 'Invalid email address',
    uniqueEmail: 'This email address is already in use',
    invalidPhone: 'Invalid phone number',
    uniquePhone: 'This phone number is already in use',
    ageError: 'Age cannot be less than 18',
    dateOrder: 'Date of employment must be after date of birth',
    confirmUpdate: 'Are you sure you want to save the changes?',
    confirmDelete: 'Are you sure you want to delete?',
    confirmDeleteEmployee: 'employee. Are you sure you want to delete?',
    employeeList: 'Employee List',
    table: 'Table',
    list: 'List',
    noResults: 'No results found',
    edit: 'Edit',
    del: 'Delete',
    firstNameLabel: 'First Name',
    lastNameLabel: 'Last Name',
    dateOfEmploymentLabel: 'Date of Employment',
    dateOfBirthLabel: 'Date of Birth',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    departmentLabel: 'Department',
    positionLabel: 'Position',
    search: 'Search',
    searchPlaceholder: 'Search by name, email, department or position...'
  }
};

let currentLang = 'en';
let listeners = [];

export function subscribe(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
}

export function t(key) {
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

export function updateLanguage() {
  const lang = document.documentElement.lang || 'en';
  currentLang = lang.startsWith('tr') ? 'tr' : 'en';
  listeners.forEach(callback => callback());
}

if (typeof window !== 'undefined') {
  if (!document.documentElement.lang) {
    document.documentElement.lang = 'en';
  }
  updateLanguage();
}