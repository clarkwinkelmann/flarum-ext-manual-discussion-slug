<?php

namespace ClarkWinkelmann\ManualDiscussionSlug\Listeners;

use ClarkWinkelmann\ManualDiscussionSlug\Validators\SlugValidator;
use Flarum\Discussion\Event\Saving;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class SaveDiscussion
{
    public function handle(Saving $event)
    {
        // Can't use isset($data['attributes']['manualSlug']) as it ignores null values
        if (Arr::exists($event->data, 'attributes') && Arr::exists($event->data['attributes'], 'manualSlug')) {
            $event->actor->assertCan('clarkwinkelmann-manual-discussion-slug.edit');

            /**
             * @var $validator SlugValidator
             */
            $validator = app(SlugValidator::class);
            $validator->assertValid([
                'slug' => $event->data['attributes']['manualSlug'],
            ]);

            $event->discussion->manual_slug = $event->data['attributes']['manualSlug'];

            if (is_null($event->discussion->manual_slug)) {
                $event->discussion->slug = Str::slug($event->discussion->title);
            }
        }

        // Force slug to be equal to the manual slug whenever it changes
        if (!is_null($event->discussion->manual_slug) && $event->discussion->slug !== $event->discussion->manual_slug) {
            $event->discussion->slug = $event->discussion->manual_slug;
        }
    }
}
