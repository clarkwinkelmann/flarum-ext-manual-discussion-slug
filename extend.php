<?php

namespace ClarkWinkelmann\ManualDiscussionSlug;

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    new Extenders\DiscussionAttributes(),
    new Extenders\ForumAttributes(),
    new Extenders\SaveDiscussion(),
];
