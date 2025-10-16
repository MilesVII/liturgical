use tauri::{AppHandle, command, Runtime};

use crate::models::*;
use crate::Result;
use crate::LitnotExt;

#[command]
pub(crate) async fn schedule<R: Runtime>(
    app: AppHandle<R>,
    payload: NotificationParams,
) -> Result<()> {
    app.litnot().schedule(payload)
}

#[command]
pub(crate) async fn cancel<R: Runtime>(
    app: AppHandle<R>
) -> Result<()> {
    app.litnot().cancel()
}
