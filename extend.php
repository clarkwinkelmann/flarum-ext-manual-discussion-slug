<?php

namespace ClarkWinkelmann\ManualDiscussionSlug;

use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Saving;
use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->attribute('manualSlug', function (DiscussionSerializer $serializer, Discussion $discussion) {
            if ($serializer->getActor()->can('clarkwinkelmann-manual-discussion-slug.edit')) {
                return $discussion->manual_slug;
            }
        }),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attribute('clarkwinkelmannManualDiscussionSlugCanEdit', function (ForumSerializer $serializer) {
            return $serializer->getActor()->can('clarkwinkelmann-manual-discussion-slug.edit');
        }),

    (new Extend\Event())
        ->listen(Saving::class, Listeners\SaveDiscussion::class),
];
