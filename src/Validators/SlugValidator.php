<?php

namespace ClarkWinkelmann\ManualDiscussionSlug\Validators;

use Flarum\Foundation\AbstractValidator;

class SlugValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'slug' => 'nullable|string|max:255',
        ];
    }
}
