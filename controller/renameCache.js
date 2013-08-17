// Rename-caches store oldName->newName mappings for labels and sessions, so that queries that fail because
// they use the old name for a label or session can be looked up in the cache and resolved.  
// renamingCache[oldName] == newName.
// Not stored in allData because we don't want to keep this around forever, just make the system more usable
// between the polls for updates.

// one cache for labels, one for sessions
renamedLabelCache = {};
renamedSessionCache = {};


// Return dictionary[name], unless name isn't found in dictionary, in which case
// we look for a renaming from name to a new name in the renameCache. 
// If name has been renamed more than once, keep looking through renamings until we find a name in the dictionary.
// If all attempts to find it fail, returns undefined.
lookupDespiteRenaming = function(dictionary, name, renameCache) {
	// chase down oldName -> newName links until we find a name that exists
	while (!(name in dictionary)) {
		name = renameCache[name]
		if (name === undefined) return undefined
	}
	return dictionary[name]
}