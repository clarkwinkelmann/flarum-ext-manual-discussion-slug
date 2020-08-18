<?php

use Flarum\Database\Migration;

return Migration::addColumns('discussions', [
    'manual_slug' => ['string', 'length' => 255, 'nullable' => true],
]);
