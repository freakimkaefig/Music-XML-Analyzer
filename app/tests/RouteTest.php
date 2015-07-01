<?php

/**
 * Example of a test class
 *
 * @package Tests
 */
class RouteTest extends TestCase {

	/**
	 * Test for home route.
	 *
	 * @return void
	 */
	public function testHomeRoute()
	{
		// Home
		$crawler = $this->client->request('GET', '/');
		$this->assertTrue($this->client->getResponse()->isOk());

	}

	/**
	 * Test for routes where user recognition is required.
	 *
	 * @return void
	 */
	public function testUploadRoute()
	{
		$uploadedFile = new Symfony\Component\HttpFoundation\File\UploadedFile(public_path() . '/ActorPreludeSample.xml', 'ActorPreludeSample.xml');
		$crawler = $this->client->request('POST', '/upload', [], [$uploadedFile]);
		$this->assertTrue($this->client->getResponse()->isOk());
	}
	public function testUploadCompleteRoute()
	{
		$uploadedFile = new Symfony\Component\HttpFoundation\File\UploadedFile(public_path() . '/ActorPreludeSample.xml', 'ActorPreludeSample.xml');
		$crawler = $this->client->request('GET', '/upload-complete');
		$this->assertRedirectedTo('search');
	}

	/**
	 * Test for routes where user recognition is required and user has uploaded files.
	 *
	 * @return void
	 */
	public function testSearchRoute()
	{
		$uploadedFile = new Symfony\Component\HttpFoundation\File\UploadedFile(public_path() . '/ActorPreludeSample.xml', 'ActorPreludeSample.xml');
		$crawler = $this->client->request('POST', '/upload', [], [$uploadedFile]);
		if ($this->assertTrue($this->client->getResponse()->isOk())) {
			$crawler = $this->client->request('GET', '/search');
			$this->assertRedirectedTo('dashboard');
		}
	}
	public function testDashboardRoute()
	{
		$uploadedFile = new Symfony\Component\HttpFoundation\File\UploadedFile(public_path() . '/ActorPreludeSample.xml', 'ActorPreludeSample.xml');
		$crawler = $this->client->request('POST', '/upload', [], [$uploadedFile]);
		if ($this->assertTrue($this->client->getResponse()->isOk())) {
			$crawler = $this->client->request('GET', '/dashboard');
			$this->assertTrue($this->client->getResponse()->isOk());
		}
	}
	public function testPatternRoute()
	{
		$uploadedFile = new Symfony\Component\HttpFoundation\File\UploadedFile(public_path() . '/ActorPreludeSample.xml', 'ActorPreludeSample.xml');
		$crawler = $this->client->request('POST', '/upload', [], [$uploadedFile]);
		if ($this->assertTrue($this->client->getResponse()->isOk())) {
			$crawler = $this->client->request('GET', '/pattern');
			$this->assertTrue($this->client->getResponse()->isOk());
		}
	}
	public function testSearchPostRoute()
	{
		$uploadedFile = new Symfony\Component\HttpFoundation\File\UploadedFile(public_path() . '/ActorPreludeSample.xml', 'ActorPreludeSample.xml');
		$crawler = $this->client->request('POST', '/upload', [], [$uploadedFile]);
		if ($this->assertTrue($this->client->getResponse()->isOk())) {
			$testPattern = '[{"type":0,"notes":[{"type":"note","pitch":{"step":"B","alter":0,"octave":"5"}},{"type":"note","pitch":{"step":"B","alter":0,"octave":"5"}}]}]';
			$crawler = $this->client->request('POST', '/search');
			$this->assertTrue($this->client->getResponse()->isOk());
		}
	}
	public function testDownloadRoute()
	{
		$uploadedFile = new Symfony\Component\HttpFoundation\File\UploadedFile(public_path() . '/ActorPreludeSample.xml', 'ActorPreludeSample.xml');
		$crawler = $this->client->request('POST', '/upload', [], [$uploadedFile]);
		if ($this->assertTrue($this->client->getResponse()->isOk())) {
			$crawler = $this->client->request('GET', '/download');
			$this->assertTrue($this->client->getResponse()->isOk());
		}
	}
	public function testResetRoute()
	{
		$uploadedFile = new Symfony\Component\HttpFoundation\File\UploadedFile(public_path() . '/ActorPreludeSample.xml', 'ActorPreludeSample.xml');
		$crawler = $this->client->request('POST', '/upload', [], [$uploadedFile]);
		if ($this->assertTrue($this->client->getResponse()->isOk())) {
			$crawler = $this->client->request('GET', '/delete-me');
			$this->assertTrue($this->client->getResponse()->isOk());
		}
	}


	/**
	 * Test for ajax routes for JSON data
	 *
	 * @return void
	 */
	public function testAjaxUploadsRoute()
	{
		$uploadedFile = new Symfony\Component\HttpFoundation\File\UploadedFile(public_path() . '/ActorPreludeSample.xml', 'ActorPreludeSample.xml');
		$crawler = $this->client->request('POST', '/upload', [], [$uploadedFile]);
		if ($this->assertTrue($this->client->getResponse()->isOk())) {

			$crawler = $this->client->request('GET', '/dashboard/getUploadIds');
			$this->assertTrue($this->client->getResponse()->isOk());
		}
	}
	public function testAjaxResultsRoute()
	{
		$uploadedFile = new Symfony\Component\HttpFoundation\File\UploadedFile(public_path() . '/ActorPreludeSample.xml', 'ActorPreludeSample.xml');
		$crawler = $this->client->request('POST', '/upload', [], [$uploadedFile]);
		if ($this->assertTrue($this->client->getResponse()->isOk())) {
			$crawler = $this->client->request('GET', '/dashboard/getResultIds');
			$this->assertTrue($this->client->getResponse()->isOk());
		}
	}

}
