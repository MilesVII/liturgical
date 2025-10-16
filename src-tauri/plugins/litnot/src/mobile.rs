use serde::de::DeserializeOwned;
use tauri::{
  plugin::{PluginApi, PluginHandle},
  AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_litnot);

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
  _app: &AppHandle<R>,
  api: PluginApi<R, C>,
) -> crate::Result<Litnot<R>> {
  #[cfg(target_os = "android")]
  let handle = api.register_android_plugin("com.plugin.litnot", "NotifyPlugin")?;
  #[cfg(target_os = "ios")]
  let handle = api.register_ios_plugin(init_plugin_litnot)?;
  Ok(Litnot(handle))
}

/// Access to the litnot APIs.
pub struct Litnot<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> Litnot<R> {
  #[cfg(target_os = "android")]
  pub fn schedule(&self, payload: NotificationParams) -> crate::Result<()> {
    self
      .0
      .run_mobile_plugin("scheduleNotification", payload)
      .map_err(Into::into)
  }
  #[cfg(target_os = "android")]
  pub fn cancel(&self) -> crate::Result<()> {
    self
      .0
      .run_mobile_plugin("cancelAll", ())
      .map_err(Into::into)
  }
}
