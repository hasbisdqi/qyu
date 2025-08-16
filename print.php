<?php
// file: print.php

use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Mike42\Escpos\Printer;

require __DIR__ . '/vendor/autoload.php'; // kalau pakai escpos-php


try {
    // koneksi ke printer langsung
    $connector = new FilePrintConnector("/dev/usb/lp0");
    $printer = new Printer($connector);

    // teks yang mau dicetak
    $printer->text("Hello Hasbi\n");
    $printer->text("Test Print ESC/POS\n");
    $printer->cut();

    $printer->close();

    echo "✅ Print berhasil\n";
} catch (Exception $e) {
    echo "❌ Print gagal: " . $e->getMessage() . "\n";
}
