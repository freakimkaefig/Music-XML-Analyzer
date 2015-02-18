<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

		$this->call('UserTableSeeder');
	}

}

class UserTableSeeder extends Seeder {

    public function run()
    {
        DB::table('results')->delete();
        DB::table('uploads')->delete();
        DB::table('users')->delete();

        $user1 = new User;
        $user1->last_activity = date('Y-m-d H:m:s', time() - 24*60*60*11);
        $user1->push();
        $upload1 = new Upload;
		$upload1->url = "test1.xml";
		$upload1->user()->associate($user1);
		$upload1->push();

        $user2 = new User;
        $user2->last_activity = date('Y-m-d H:m:s', time() + 24*60*60*9);
        $user2->push();
		$upload2 = new Upload;
		$upload2->url = "test2.xml";
		$upload2->user()->associate($user2);
		$upload2->push();
		$upload3 = new Upload;
		$upload3->url = "test3.xml";
		$upload3->user()->associate($user2);
		$upload3->push();
		$result1 = new Result;
		$result1->value = "Testvalue1";
		$result1->upload()->associate($upload2);
		$result1->push();

        $user3 = new User;
        $user3->last_activity = date('Y-m-d H:m:s', time() - 24*60*60*8);
        $user3->push();
		$upload4 = new Upload;
		$upload4->url = "test4.xml";
		$upload4->user()->associate($user3);
		$upload4->push();
		$upload5 = new Upload;
		$upload5->url = "test5.xml";
		$upload5->user()->associate($user3);
		$upload5->push();
		$upload6 = new Upload;
		$upload6->url = "test6.xml";
		$upload6->user()->associate($user3);
		$upload6->push();
		$result2 = new Result;
		$result2->value = "Testvalue2";
		$result2->upload()->associate($upload4);
		$result2->push();
		$result3 = new Result;
		$result3->value = "Testvalue3";
		$result3->upload()->associate($upload5);
		$result3->push();
        
        $user4 = new User;
        $user4->last_activity = date('Y-m-d H:m:s', time() - 24*60*60*16);
        $user4->push();
    }

}
