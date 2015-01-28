<?php

class DashboardController extends BaseController {

	public function getToDashboard()
	{
		return View::make('dashboard');
	}
}
