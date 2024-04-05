# TUGAS BESAR 1 GRAFIKA KOMPUTER - IF3260
> Tugas Besar 1: WebGL Part 1: 2D Primitive Elements

## Anggota Kelompok
<table>
    <tr>
        <td colspan="3", align = "center"><center>Nama Kelompok: web-based GL (WBG)</center></td>
    </tr>
    <tr>
        <td>No.</td>
        <td>Nama</td>
        <td>NIM</td>
    </tr>
    <tr>
        <td>1.</td>
        <td>Bintang Hijriawan</td>
        <td>13521003</td>
    </tr>
    <tr>
        <td>2.</td>
        <td>Jason Rivalino</td>
        <td>13521008</td>
    </tr>
    <tr>
        <td>3.</td>
        <td>M. Malik I. Baharsyah</td>
        <td>13521029</td>
    </tr>
</table>

## Table of Contents
* [Deskripsi Singkat](#deskripsi-singkat)
* [Struktur File](#struktur-file)
* [Requirements](#requirements)
* [Cara Menjalankan Program](#cara-menjalankan-program)
* [Tampilan Interface Program](#tampilan-interface-program)
* [Acknowledgements](#acknowledgements)

## Deskripsi Singkat 
Pada pengerjaan Tugas Besar 1 dari mata kuliah Grafika Komputer ini, pengerjaan yang dilakukan adalah untuk membangun program sederhana untuk penggambaran garis dan bangun datar sederhana seperti persegi, persegi panjang, dan poligon dengan memanfaatkan model geometri. Dari model penggambaran bangun datar yang telah dilakukan kemudian akan dapat dilakukan berbagai modifikasi terhadap model tersebut mulai dari pengubahan warna, jumlah dan posisi dari titik sudut, hingga berbagai macam proses transformasi mulai dari translasi, rotasi, dilatasi, hingga shear. Program yang ada juga dapat melakukan penyimpanan (save) dan memuat kembali (load) dari model penggambaran yang telah dilakukan. Terakhir untuk implementasi fitur lanjutan yang dibuat adalah untuk penggambaran poligon dengan memanfaatkan Convex Hull dan juga menggambar bangun datar lingkaran. Adapun untuk keseluruhan program yang ada, untuk tampilan website dibangun dengan menggunakan HTML + CSS dan untuk sistem penggambaran pada program dibangun dengan menggunakan JavaScript API WebGL.

## Fitur yang diimplementasi
1. Menggambar garis, persegi, persegi panjang, dan poligon
2. Melakukan proses transformasi (translasi, rotasi, dilatasi, shear) pada model bidang
3. Mengubah warna dari bidang untuk satu atau seluruh sudut
4. Mengubah titik sudut dari objek model
5. Melakukan save dan load data dalam bentuk file JSON
6. Fitur lanjutan 1: pencarian bentuk Poligon dengan Convex Hull
7. Fitur lanjutan 2: menggambar model objek lingkaran

## Beberapa fungsi yang dibuat
1. Fungsi handleMouseDown, handleMouseMove, handleMouseUp: untuk mengatur proses menggambar saat berada di canvas
2. Fungsi addVertexToPolygon: fungsi khusus untuk menambahkan koordinat vertices untuk bidang poligon
3. Fungsi reDrawAllShapes: untuk menggambar ulang semua shape
4. Fungsi hexToRGB: untuk mengubah warna dari hexadecimal kedalam bentuk RGB
5. Fungsi getMinMaxX, getMinMaxY: untuk mendapatkan nilai minimal-maksimal dari objek untuk proses transformasi
6. Fungsi getSelectedShapeIndex: untuk mendapatkan indeks dari shape yang dipilih
7. Fungsi setupShapeDrawing: untuk memulai proses menggambar, disini dilakukan proses inisiasi untuk vertices dan fragment sebelum dilakukan shader
8. Fungsi reDrawShape: untuk membantu pembentukan gambar shape
9. Fungsi drawShape: untuk proses menggambar keseluruhan dimulai dari memasukkan vertices, menentukan primitif, proses gambar, hingga memasukkan data dalam array shape dan visualisasi di web (untuk garis, persegi, dan persegi panjang)
10. Fungsi drawPolygon: sama seperti drawShape, tetapi untuk poligon
11. Fungsi drawCircle: sama seperti drawShape, tetapi untuk lingkaran
12. Fungsi convexHull dan crossProduct: untuk melakukan perhitungan pencarian titik convex hull pada poligon
13. Fungsi getNumberOfShapeChecked: untuk mendapatkan jumlah dari total bidang yang dichecklist pada list
14. Fungsi getNumberOfCornerChecked: untuk mendapatkan jumlah dari total sudut yang dichecklist pada list
15. Fungsi storeShape: untuk memasukkan berbagai macam jenis shape pada canvas ke dalam list of shape
16. Fungsi displayShapeList: untuk visualisasi list shape dan titik sudut yang digambar pada canvas

## Struktur File
```
📦tugas-besar-grafkom-1-web-based-gl-wbg
 ┣ 📂doc
 ┃ ┣ 📜Laporan Tugas Besar 1 Grafkom_Web Based GL (WBG).pdf
 ┃ ┗ 📜Spesifikasi Tugas Besar 1 - IF3260 Grafika Komputer.pdf
 ┣ 📂src
 ┃ ┣ 📜index.html
 ┃ ┣ 📜main.js
 ┃ ┗ 📜style.css
 ┣ 📂test
 ┃ ┣ 📜testcase1(kotak).json
 ┃ ┣ 📜testcase2(poligon).json
 ┃ ┣ 📜testcase3(banyakshape).json
 ┃ ┣ 📜testcase4(lingkaran).json
 ┃ ┗ 📜testcase5(gambarsd).json
 ┗ 📜README.md
```
 
## Requirements
1. Visual Studio Code
2. Web Browser App (Edge, Mozila, Chrome, etc...)

## Cara Menjalankan Program
Langkah-langkah proses setup program adalah sebagai berikut:
1. Clone repository ini
2. Buka file `index.html` dari repository ini yang terdapat pada folder src
3. Program sudah berhasil berjalan, untuk menggunakan aplikasi dapat mengikuti petunjuk yang ada pada panduan penggunaan program

## Tampilan Interface Program
![image](https://github.com/GAIB20/tugas-besar-grafkom-1-web-based-gl-wbg/assets/91790457/deef1e61-0b02-4bb6-a0ef-7c5ccc8f1859)

## Acknowledgements
- Tuhan Yang Maha Esa
- Dosen Mata Kuliah Grafika Komputer IF3260
- Kakak-Kakak Asisten Mata Kuliah Grafika Komputer IF3260
