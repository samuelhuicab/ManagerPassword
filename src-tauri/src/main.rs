// Prevents additional console window on Windows in release, DO NOT REMOVE!!
mod commands;
mod models;
mod services;
mod storage;
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    passcontroller_lib::run()
}
