const STORAGE_KEY = "smart-gpa-calculator-courses";
//fungsi dari const storage_key untuk
//sumber : 

const defaultCourses = [
  { name: "Data Structures", credits: 3, grade: 4 },
  { name: "Web Programming", credits: 3, grade: 3.7 },
  { name: "Database Systems", credits: 3, grade: 3.3 },
];
//fungsi dari defaultcourses untuk memungkinkan parameter bernama diinisialisasi dengan nilai default jika tidak ada nilai atau undefined yang diberikan … , /* …, */ paramN = defaultValueN) { // … } Dalam JavaScript, parameter fungsi secara default bernilai undefined. … Namun, seringkali berguna untuk menetapkan nilai default yang berbeda. Di sinilah parameter default dapat membantu.
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

  if (!storedCourses) {
    return cloneCourses(defaultCourses);
  }

  try {
    const courses = JSON.parse(storedCourses);
    return Array.isArray(courses) ? courses : cloneCourses(defaultCourses);
  } catch {
    return cloneCourses(defaultCourses);
  }
};
//fungsi dari read courses untuk
//sumber :

let courses = readCourses();

const formatNumber = (value) => Number(value || 0).toFixed(2);

const saveCourses = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};

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

    creditsInput.addEventListener("input", (event) => {
      updateCourse(index, "credits", event.target.value, row);
    });

    gradeSelect.addEventListener("change", (event) => {
      updateCourse(index, "grade", event.target.value, row);
    });

    removeButton.addEventListener("click", () => {
      courses = courses.filter((_, courseIndex) => courseIndex !== index);
      saveCourses();
      renderCourses();
    });

    courseList.append(row);
  });

  calculateTotals();
};

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

resetButton.addEventListener("click", () => {
  courses = cloneCourses(defaultCourses);
  saveCourses();
  renderCourses();
});

renderCourses();
