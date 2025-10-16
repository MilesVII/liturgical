package com.plugin.litnot

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import java.util.*

object NotificationScheduler {
	fun scheduleNotification(
		context: Context,
		startMillis: Long,
		intervalDays: Int,
		title: String,
		body: String,
		id: Int
	) {
		val intent = Intent(context, NotificationReceiver::class.java)
		intent.putExtra("title", title)
		intent.putExtra("body", body)
		intent.putExtra("notification_id", id);

		val pending = PendingIntent.getBroadcast(
			context,
			0,
			intent,
			PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
		)

		val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
		val intervalMillis = intervalDays * 24 * 60 * 60 * 1000L

		alarmManager.setRepeating(
			AlarmManager.RTC_WAKEUP,
			startMillis,
			intervalMillis,
			pending
		)
	}

	fun cancelAll(context: Context) {
		val intent = Intent(context, NotificationReceiver::class.java)
		val pending = PendingIntent.getBroadcast(
			context, 0, intent,
			PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
		)
		val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
		alarmManager.cancel(pending)
	}
}
