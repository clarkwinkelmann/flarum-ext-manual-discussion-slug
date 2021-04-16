/* global app */

app.initializers.add('clarkwinkelmann-manual-discussion-slug', () => {
    app.extensionData
        .for('clarkwinkelmann-manual-discussion-slug')
        .registerPermission({
            icon: 'fas fa-i-cursor',
            label: app.translator.trans('clarkwinkelmann-manual-discussion-slug.admin.permissions.edit'),
            permission: 'clarkwinkelmann-manual-discussion-slug.edit',
        }, 'moderate');
});
