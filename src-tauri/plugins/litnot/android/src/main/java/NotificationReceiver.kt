package com.plugin.litnot

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat

class NotificationReceiver : BroadcastReceiver() {
	override fun onReceive(context: Context, intent: Intent) {
		val title = intent.getStringExtra("title") ?: ""
		val body = intent.getStringExtra("body") ?: ""
		val nid = intent.getIntExtra("notification_id") ?: 0

		val channelId = "liturgies_channel"

		val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
		val channel = NotificationChannel(channelId, "liturgies", NotificationManager.IMPORTANCE_DEFAULT)
		manager.createNotificationChannel(channel)

		val notification = NotificationCompat.Builder(context, channelId)
			.setContentTitle(title)
			.setContentText(body)
			.setSmallIcon(android.R.drawable.ic_dialog_info)
			.setAutoCancel(true)
			.build()

		manager.notify(nid, notification)
	}
}
