// Array untuk menyimpan data siswa
let students = [];

document.getElementById("studentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Ambil nilai dari form
  const nama = document.getElementById("nama").value;
  const kelas = document.getElementById("kelas").value;
  const alamat = document.getElementById("alamat").value;
  const nilaiIpa = parseFloat(document.getElementById("nilaiIpa").value);
  const nilaiIps = parseFloat(document.getElementById("nilaiIps").value);
  const nilaiMatematika = parseFloat(
    document.getElementById("nilaiMatematika").value
  );
  const nilaiBahasaInggris = parseFloat(
    document.getElementById("nilaiBahasaInggris").value
  );

  // Validasi nilai
  if (
    nilaiIpa < 0 ||
    nilaiIpa > 100 ||
    nilaiIps < 0 ||
    nilaiIps > 100 ||
    nilaiMatematika < 0 ||
    nilaiMatematika > 100 ||
    nilaiBahasaInggris < 0 ||
    nilaiBahasaInggris > 100
  ) {
    alert("Nilai harus antara 0 dan 100");
    return;
  }

  // Hitung rata-rata
  const rataRata =
    (nilaiIpa + nilaiIps + nilaiMatematika + nilaiBahasaInggris) / 4;

  // Buat objek siswa
  const siswa = {
    nama,
    kelas,
    alamat,
    nilaiIpa,
    nilaiIps,
    nilaiMatematika,
    nilaiBahasaInggris,
    rataRata: rataRata.toFixed(2),
  };

  // Tambahkan siswa ke array
  students.push(siswa);

  // Urutkan siswa berdasarkan rata-rata (descending)
  students.sort((a, b) => b.rataRata - a.rataRata);

  // Update peringkat
  updateRankings();

  // Tampilkan semua data di tabel
  displayAllStudents();

  // Tampilkan section data
  document.getElementById("dataSection").style.display = "block";

  // Reset form
  document.getElementById("studentForm").reset();

  // Scroll ke tabel
  document.getElementById("dataSection").scrollIntoView({ behavior: "smooth" });
});

// Fungsi untuk update peringkat
function updateRankings() {
  students.forEach((student, index) => {
    student.peringkat = index + 1;
  });
}

// Fungsi untuk menampilkan semua siswa di tabel
function displayAllStudents() {
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = "";

  students.forEach((siswa, index) => {
    // Buat baris baru
    const newRow = document.createElement("tr");

    // Tambahkan kelas untuk peringkat 1, 2, 3
    if (siswa.peringkat === 1) {
      newRow.classList.add("ranking-1");
    } else if (siswa.peringkat === 2) {
      newRow.classList.add("ranking-2");
    } else if (siswa.peringkat === 3) {
      newRow.classList.add("ranking-3");
    }

    // Tentukan kelas untuk nilai berdasarkan rentang
    function getScoreClass(score) {
      if (score >= 85) return "score-good";
      if (score >= 70) return "";
      if (score >= 60) return "score-average";
      return "score-poor";
    }

    // Isi baris dengan data siswa
    newRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${siswa.nama}</td>
                    <td>Kelas ${siswa.kelas}</td>
                    <td>${siswa.alamat}</td>
                    <td class="${getScoreClass(siswa.nilaiIpa)}">${siswa.nilaiIpa}</td>
                    <td class="${getScoreClass(siswa.nilaiIps)}">${siswa.nilaiIps}</td>
                    <td class="${getScoreClass(siswa.nilaiMatematika)}">${siswa.nilaiMatematika}</td>
                    <td class="${getScoreClass(siswa.nilaiBahasaInggris)}">${siswa.nilaiBahasaInggris}</td>
                    <td class="${getScoreClass(siswa.rataRata)}">${siswa.rataRata}</td>
                    <td>
                        <span class="ranking-badge">${siswa.peringkat}</span>
                    </td>
                `;

    // Tambahkan baris ke tabel
    tableBody.appendChild(newRow);
  });
}

// Fungsi untuk reset data
function resetData() {
  if (confirm("Apakah Anda yakin ingin menghapus semua data siswa?")) {
    students = [];
    document.getElementById("studentTableBody").innerHTML = "";
    document.getElementById("dataSection").style.display = "none";
  }
}

// Fungsi untuk print tabel
function printTable() {
  // Update tanggal cetak
  document.getElementById("printDate").textContent =
    new Date().toLocaleString();

  // Tampilkan info untuk PDF
  document.getElementById("pdfInfo").style.display = "block";

  window.print();

  // Sembunyikan info untuk PDF setelah print
  setTimeout(() => {
    document.getElementById("pdfInfo").style.display = "none";
  }, 500);
}

// Fungsi untuk export ke PDF
function exportToPDF() {
  // Update tanggal cetak
  document.getElementById("printDate").textContent =
    new Date().toLocaleString();

  // Tampilkan info untuk PDF
  document.getElementById("pdfInfo").style.display = "block";

  // Gunakan html2canvas dan jsPDF
  const { jsPDF } = window.jspdf;

  // Ambil elemen yang akan di-convert ke PDF
  const element = document.getElementById("dataSection");

  html2canvas(element, {
    scale: 2, // Tingkatkan kualitas
    useCORS: true,
    logging: false,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Tambah halaman baru jika konten terlalu panjang
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Simpan PDF
    pdf.save("data-siswa.pdf");

    // Sembunyikan info untuk PDF setelah export
    document.getElementById("pdfInfo").style.display = "none";
  });
}

// Tambahkan CSS untuk print
const style = document.createElement("style");
style.innerHTML = `
            @media print {
                .no-print { display: none !important; }
                body { background: white !important; }
                .card { box-shadow: none !important; border: 1px solid #ddd !important; }
                .table { box-shadow: none !important; }
                .header { display: none !important; }
                .action-buttons { display: none !important; }
                .alert-success { display: none !important; }
            }
        `;
document.head.appendChild(style);
