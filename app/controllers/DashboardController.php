<?php

class DashboardController extends BaseController {

	public function getToDashboard()
	{
		return View::make('dashboard');
	}

	public function getToSearch()
	{
		return View::make('search');
	}
}
