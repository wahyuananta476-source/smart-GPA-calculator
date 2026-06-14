const STORAGE_KEY = "smart-gpa-calculator-courses";
//fungsi dari const storage_key untuk memungkinkan dalam mengakses objek `Storage` untuk asal Dokumen; data yang tersimpan akan tetap tersimpan di seluruh sesi browser.
//sumber : https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

const defaultCourses = [
  { name: "Data Structures", credits: 3, grade: 4 },
  { name: "Web Programming", credits: 3, grade: 3.7 },
  { name: "Database Systems", credits: 3, grade: 3.3 },
];
// pada bagian ini data awal yang ditampilkan ketika belum ada data tersimpan. lalu fungsi dari defaultcourses untuk memungkinkan parameter bernama diinisialisasi dengan nilai default jika tidak ada nilai atau undefined yang diberikan … , /* …, */ paramN = defaultValueN) { // … } Dalam JavaScript, parameter fungsi secara default bernilai undefined. … Namun, seringkali berguna untuk menetapkan nilai default yang berbeda. Di sinilah parameter default dapat membantu.
//sumber : https://developer.mozilla.org/en-US/search?q=const+defaultCourses

const courseList = document.querySelector("#course-list");
const rowTemplate = document.querySelector("#course-row-template");
const cumulativeGpa = document.querySelector("#cumulative-gpa");
const totalCredits = document.querySelector("#total-credits");
const qualityPoints = document.querySelector("#quality-points");
const addCourseButton = document.querySelector("#add-course");
const resetButton = document.querySelector("#reset-data");
//fungsi dari document.querySelector adalah untuk mengembalikan elemen pertama dalam dokumen yang cocok dengan pemilih CSS yang ditentukan, atau kelompok pemilih CSS. Jika tidak ditemukan kecocokan, nilai `null` akan dikembalikan.
//sumber : https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector

const cloneCourses = (courseItems) => courseItems.map((course) => ({ ...course }));
//fungsi dari clone courses untuk membuat salinan data baru tanpa mengubah struktur data aslinya
//sumber : https://coreui.io/blog/how-to-clone-an-object-in-javascript/

const readCourses = () => {
  const storedCourses = localStorage.getItem(STORAGE_KEY);
  //pada bagian ini untuk membaca data mata kuliah yang tersimpan pada browser. lalu fungsi dari Metode getItem() dari antarmuka Storage, ketika diberikan nama kunci, akan mengembalikan nilai kunci tersebut, atau null jika kunci tersebut tidak ada, dalam objek Storage yang diberikan.
  //sumber : https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
  
  if (!storedCourses) {
    return cloneCourses(defaultCourses);
  }

  try {
    const courses = JSON.parse(storedCourses);
    //fungsi dari Metode statis JSON.parse() mengurai string JSON, membangun nilai atau objek JavaScript yang dijelaskan oleh string tersebut. Fungsi reviver opsional dapat diberikan untuk melakukan transformasi pada objek hasil sebelum dikembalikan.
    //sumber : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
    
    return Array.isArray(courses) ? courses : cloneCourses(defaultCourses);
  } catch {
    return cloneCourses(defaultCourses);
  }
};

let courses = readCourses();
//fungsi Deklarasi `let` untuk mendeklarasikan variabel lokal yang dapat diberi nilai ulang dan berada dalam lingkup blok, yang secara opsional menginisialisasi setiap variabel dengan suatu nilai.
//sumber : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let

const formatNumber = (value) => Number(value || 0).toFixed(2);
//fungsi Metode toFixed() dari nilai Number untuk mengembalikan string yang mewakili angka ini menggunakan notasi titik tetap dengan jumlah tempat desimal yang ditentukan.
// sumber : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed

const saveCourses = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};
//pada bagian ini untuk menyimpan array courses ke Local Storage. lalu fungsi Metode statis JSON.stringify() untuk mengkonversi nilai JavaScript ke string JSON, secara opsional mengganti nilai jika fungsi pengganti ditentukan atau secara opsional hanya menyertakan properti yang ditentukan jika array pengganti ditentukan.
//sumber : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

const calculateTotals = () => {
  const totals = courses.reduce(
    (result, course) => {
      const credits = Number(course.credits) || 0;
      const grade = Number(course.grade) || 0;

      result.credits += credits;
      result.points += credits * grade;
      return result;
    },
    { credits: 0, points: 0 },
  );

  const gpa = totals.credits > 0 ? totals.points / totals.credits : 0;

  cumulativeGpa.textContent = formatNumber(gpa);
  totalCredits.textContent = String(totals.credits);
  qualityPoints.textContent = formatNumber(totals.points);
};
//pada kode bagian ini untuk Menghitung total SKS, total mutu dan GPA. lalu fungsi pada Metode `reduce()` pada instance `Array` mengeksekusi fungsi callback "reducer" yang diberikan pengguna pada setiap elemen array, secara berurutan, dengan meneruskan nilai kembalian dari perhitungan pada elemen sebelumnya. 
//sumber : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

const updateCourse = (index, field, value, row) => {
  courses[index] = {
    ...courses[index],
    [field]: field === "name" ? value : Number(value),
  };

  const pointsCell = row.querySelector(".row-points");
  pointsCell.textContent = formatNumber(Number(courses[index].credits) * Number(courses[index].grade));

  saveCourses();
  calculateTotals();
};
//pada bagian ini untuk memperbarui data mata kuliah ketika pengguna mengubah nama, SKS atau nilai. lalu fungsinya untuk memasukkan ekspresi dalam tanda kurung siku [], yang akan dihitung dan digunakan sebagai nama properti.
//sumber : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names

const renderCourses = () => {
  courseList.innerHTML = "";

  courses.forEach((course, index) => {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    const nameInput = row.querySelector(".course-name");
    const creditsInput = row.querySelector(".course-credits");
    const gradeSelect = row.querySelector(".course-grade");
    const pointsCell = row.querySelector(".row-points");
    const removeButton = row.querySelector(".remove-course");

    nameInput.value = course.name;
    creditsInput.value = course.credits;
    gradeSelect.value = String(course.grade);
    pointsCell.textContent = formatNumber(Number(course.credits) * Number(course.grade));

    nameInput.addEventListener("input", (event) => {
      updateCourse(index, "name", event.target.value, row);
    });
    //pada kode ini Event "input" dijalankan setiap kali pengguna mengetik pada textbox. lalu fungsi input dipicu ketika nilai elemen <input>, <select>, atau <textarea> telah diubah sebagai akibat langsung dari tindakan pengguna (seperti mengetik di kotak teks atau mencentang kotak centang).
    //sumber : https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event
    
    creditsInput.addEventListener("input", (event) => {
      updateCourse(index, "credits", event.target.value, row);
    });

    gradeSelect.addEventListener("change", (event) => {
      updateCourse(index, "grade", event.target.value, row);
    });
    //pada kode ini Event "change" dijalankan ketika nilai dropdown berubah. lalu fungsi dari change event dipicu untuk elemen <input>, <select>, dan <textarea> ketika pengguna memodifikasi nilai elemen tersebut. Tidak seperti peristiwa input, peristiwa perubahan tidak selalu dipicu untuk setiap perubahan pada nilai suatu elemen.
    //sumber : https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event

    removeButton.addEventListener("click", () => {
      courses = courses.filter((_, courseIndex) => courseIndex !== index);
      saveCourses();
      renderCourses();
    });
    //pada kode ini untuk menghapus mata kuliah menggunakan filter(). filter() membuat array baru berdasarkan kondisi. lalu fungsi Metode filter() pada instance Array untuk membuat salinan dangkal dari sebagian array yang diberikan, yang difilter hanya untuk elemen-elemen dari array yang diberikan yang lolos uji yang diterapkan oleh fungsi yang disediakan.
    //sumber : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

    courseList.append(row);
  });

  calculateTotals();
};
//pada kode ini untuk menampilkan seluruh data mata kuliah ke tabel. lalu fungsi Metode cloneNode() dari antarmuka Node untuk mengembalikan duplikat dari node tempat metode ini dipanggil. Parameternya mengontrol apakah subpohon yang terdapat dalam node tersebut juga dikloning atau tidak.
//sumber : https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode

addCourseButton.addEventListener("click", () => {
  courses = [
    ...courses,
    {
      name: "",
      credits: 3,
      grade: 4,
    },
  ];
  saveCourses();
  renderCourses();
});
//pada kode ini untuk menambahkan mata kuliah baru ke array. Spread operator digunakan untuk mempertahankan data lama lalu menambahkan data baru. lalu fungsi spread sintaks untuk menghitung properti objek dan menambahkan pasangan kunci-nilai ke objek yang sedang dibuat.
//sumber : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax

resetButton.addEventListener("click", () => {
  courses = cloneCourses(defaultCourses);
  saveCourses();
  renderCourses();
});
//pada kode ini untuk mengembalikan data ke kondisi awal menggunakan defaultCourses.

renderCourses();
//pada kode ini untuk memanggil fungsi renderCourses() saat aplikasi pertama kali dibuka agar data langsung ditampilkan.
//sumber : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
