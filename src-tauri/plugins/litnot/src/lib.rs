use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::Litnot;
#[cfg(mobile)]
use mobile::Litnot;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the litnot APIs.
pub trait LitnotExt<R: Runtime> {
  fn litnot(&self) -> &Litnot<R>;
}

impl<R: Runtime, T: Manager<R>> crate::LitnotExt<R> for T {
  fn litnot(&self) -> &Litnot<R> {
    self.state::<Litnot<R>>().inner()
  }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("litnot")
  .invoke_handler(tauri::generate_handler![
    commands::schedule,
    commands::cancel
  ])
    .setup(|app, api| {
      #[cfg(mobile)]
      let litnot = mobile::init(app, api)?;
      #[cfg(desktop)]
      let litnot = desktop::init(app, api)?;
      app.manage(litnot);
      Ok(())
    })
    .build()
}
