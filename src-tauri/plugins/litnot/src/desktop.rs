use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
  app: &AppHandle<R>,
  _api: PluginApi<R, C>,
) -> crate::Result<Litnot<R>> {
  Ok(Litnot(app.clone()))
}

/// Access to the litnot APIs.
pub struct Litnot<R: Runtime>(AppHandle<R>);

impl<R: Runtime> Litnot<R> {
  pub fn schedule(&self, _payload: NotificationParams) -> crate::Result<()> {
    return Ok(());
  }
  pub fn cancel(&self) -> crate::Result<()> {
    return Ok(());
  }
}
