package com.plugin.litnot

import android.app.Activity
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke

@InvokeArg
class Args {
	var start: Long = 0
	var days: Int = 0
	var title: String = ""
	var body: String = ""
	var id: Int = 0
}

@TauriPlugin
class NotifyPlugin(private val activity: Activity) : Plugin(activity) {

	@Command
	fun scheduleNotification(invoke: Invoke) {
		val args = invoke.parseArgs(Args::class.java)

		NotificationScheduler.scheduleNotification(
			context      = activity,
			startMillis  = args.start,
			intervalDays = args.days,
			title        = args.title,
			body         = args.body,
			id           = args.id
		)
		invoke.resolve();
	}

	@Command
	fun cancelAll(invoke: Invoke) {
		NotificationScheduler.cancelAll(activity)
		invoke.resolve();
	}
}