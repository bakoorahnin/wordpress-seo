<?php

namespace Yoast\WP\SEO\Tests\Unit;

use Brain\Monkey;
use WPSEO_Options;
use Yoast\WPTestUtils\BrainMonkey\YoastTestCase;

/**
 * TestCase base class.
 */
abstract class TestCase extends YoastTestCase {

	/**
	 * Options being mocked.
	 *
	 * @var array
	 */
	protected $mocked_options = [ 'wpseo', 'wpseo_titles', 'wpseo_taxonomy_meta', 'wpseo_social', 'wpseo_ms' ];

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		Monkey\Functions\stubs(
			[
				// Null makes it so the function returns its first argument.
				'is_admin'             => false,
			]
		);
// TO DISCUSS: These two expectations do not belong in `set_up()` and are causing every test to have an inflated assertion count of +2.
/*
THIS DOESN'T WORK - `with()`is not available on stubs using `when()`
		Monkey\Functions\when( 'get_option' )
			->with( \call_user_func_array( 'Mockery::anyOf', $this->mocked_options ) )
			->justReturn( [] );
		Monkey\Functions\when( 'get_site_option' )
			->with( \call_user_func_array( 'Mockery::anyOf', $this->mocked_options ) )
			->justReturn( [] );
*/

		Monkey\Functions\expect( 'get_option' )
			->zeroOrMoreTimes()
			->with( \call_user_func_array( 'Mockery::anyOf', $this->mocked_options ) )
			->andReturn( [] );

		Monkey\Functions\expect( 'get_site_option' )
			->zeroOrMoreTimes()
			->with( \call_user_func_array( 'Mockery::anyOf', $this->mocked_options ) )
			->andReturn( [] );

		// This is required to ensure backfill and other statics are set.
		WPSEO_Options::get_instance();
	}
}
