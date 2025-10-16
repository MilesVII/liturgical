use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NotificationParams {
  pub start: i64,
  pub days: i32,
  pub title: String,
  pub body: String,
}
