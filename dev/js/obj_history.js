// start of file

//-------------------
// History Object
//-------------------

	function History(pn) {
		this.queue = [];
		this.parentname = pn;
		this.currstate = clone(_GP[this.parentname]);
		this.initialstate = clone(_GP[this.parentname]);
	}

	History.prototype.put = function(des) {
		// debug('\n History.put - START');

		this.queue.push({
			'charname': getCurrentWorkingObjectName(),
			'description': des,
			'date': new Date().getTime(),
			'state': clone(this.currstate)
		});

		this.currstate = clone(_GP[this.parentname]);

		setProjectAsUnsaved();

		// debug(' History.put - END\n');
	};

	History.prototype.pull = function() {
		// debug('\n History.pull - START');
		// debug('\t queue.length ' + this.queue.length);

		var top = this.queue.length? this.queue.pop().state : this.initialstate;		
		_GP[this.parentname] = clone(top);
		this.currstate = clone(top);
		if (_UI.navhere === 'import svg') update_NavPanels();
		else redraw('history_pull');

		// debug('\t after redraw');

		var empty = true;
		for(var q in _UI.history){ if(_UI.history.hasOwnProperty(q)){
			if(_UI.history[q].queue.length){
				empty = false;
				break;
			}
		}}
		if(empty) setProjectAsSaved();

		// debug(' History.pull - END\n');
	};
	
	// Global Accessor Functions
	function history_put(dsc){ _UI.history[_UI.navhere].put(dsc); }
	function history_pull(){ _UI.history[_UI.navhere].pull(); }
	function history_length() { return _UI.history[_UI.navhere].queue.length || 0; }
	
	// Name Stuff
	function getCurrentWorkingObjectName() {
		switch(_UI.navhere){
			case 'character edit':
			case 'linked shapes':
				return getSelectedCharName();
			case 'ligatures':
				return 'ligature ' + getSelectedCharName();
			case 'kerning':
				return getSelectedKernName();
		}

		return 'no working object';
	}

// end of file