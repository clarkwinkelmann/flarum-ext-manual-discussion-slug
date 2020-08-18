import {extend} from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('clarkwinkelmann/flarum-ext-author-change', () => {
    extend(PermissionGrid.prototype, 'moderateItems', items => {
        items.add('clarkwinkelmann-manual-discussion-slug', {
            icon: 'fas fa-i-cursor',
            label: app.translator.trans('clarkwinkelmann-manual-discussion-slug.admin.permissions.edit'),
            permission: 'clarkwinkelmann-manual-discussion-slug.edit',
        });
    });
});
