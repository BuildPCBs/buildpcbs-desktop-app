use std::fs::File;
use std::io::Write;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_file(path: String, contents: String) -> Result<(), String> {
    println!("Request to save file: {}", path);
    match std::env::current_dir() {
        Ok(cwd) => println!("Current Working Directory: {:?}", cwd),
        Err(e) => println!("Could not get CWD: {}", e),
    }

    // Simple resolution to Home directory to avoid permission issues
    let final_path = if let Ok(home) = std::env::var("HOME") {
        let save_dir = std::path::Path::new(&home).join("Documents");
        if !save_dir.exists() {
             let _ = std::fs::create_dir_all(&save_dir);
        }
        save_dir.join(&path).to_string_lossy().to_string()
    } else {
        path // Fallback
    };

    println!("Writing to: {}", final_path);

    let mut file = File::create(&final_path).map_err(|e| e.to_string())?;
    file.write_all(contents.as_bytes()).map_err(|e| e.to_string())?;
    Ok(())
}

use tauri::menu::{MenuBuilder, SubmenuBuilder, PredefinedMenuItem};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // App Menu (macOS only - shows as "BuildPCBs AI")
            let app_menu = SubmenuBuilder::new(app, "BuildPCBs AI")
                .about(None)
                .separator()
                .text("preferences", "Preferences...")
                .separator()
                .services()
                .separator()
                .hide()
                .hide_others()
                .show_all()
                .separator()
                .quit()
                .build()?;

            // File Menu
            let file_menu = SubmenuBuilder::new(app, "File")
                .text("new", "New Project")
                .text("open", "Open...")
                .separator()
                .text("save", "Save")
                .text("save-as", "Save As...")
                .separator()
                .items(&[
                    &SubmenuBuilder::new(app, "Export")
                        .text("export-stl", "Export as STL...")
                        .text("export-step", "Export as STEP...")
                        .text("export-pdf", "Export as PDF...")
                        .build()?,
                ])
                .separator()
                .close_window()
                .build()?;

            // Edit Menu
            let edit_menu = SubmenuBuilder::new(app, "Edit")
                .undo()
                .redo()
                .separator()
                .cut()
                .copy()
                .paste()
                .select_all()
                .build()?;

            // View Menu
            let view_menu = SubmenuBuilder::new(app, "View")
                .text("toggle-properties", "Toggle Properties Panel")
                .text("toggle-terminal", "Toggle Terminal")
                .separator()
                .items(&[
                    &SubmenuBuilder::new(app, "Camera")
                        .text("camera-top", "Top View")
                        .text("camera-front", "Front View")
                        .text("camera-side", "Side View")
                        .text("camera-iso", "Isometric View")
                        .build()?,
                ])
                .separator()
                .text("toggle-grid", "Toggle Grid")
                .text("toggle-exploded", "Toggle Exploded View")
                .text("toggle-clipping", "Toggle Clipping Plane")
                .separator()
                .text("fullscreen", "Enter Full Screen")
                .build()?;

            // Window Menu
            let window_menu = SubmenuBuilder::new(app, "Window")
                .minimize()
                .maximize()
                .separator()
                .close_window()
                .build()?;

            // Help Menu
            let help_menu = SubmenuBuilder::new(app, "Help")
                .text("documentation", "Documentation")
                .text("shortcuts", "Keyboard Shortcuts")
                .build()?;

            // Build and set the complete menu
            let menu = MenuBuilder::new(app)
                .item(&app_menu)
                .item(&file_menu)
                .item(&edit_menu)
                .item(&view_menu)
                .item(&window_menu)
                .item(&help_menu)
                .build()?;

            app.set_menu(menu)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, save_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
