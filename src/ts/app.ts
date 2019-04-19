import * as MRE from '@microsoft/mixed-reality-extension-sdk';

import { Nametag, Table } from './presentation';

export class App {
	public table: Table;
	public nametags: Nametag[];

	constructor(public context: MRE.Context, public baseUrl: string, public params: MRE.ParameterSet = {}) {
		context.onStarted(() => this.start());
		context.onStopped(() => this.stop());
		context.onUserJoined(user => this.userJoin(user));
		context.onUserLeft(user => this.userLeft(user));
	}

	public async start() {
		const ag = await this.context.assetManager.loadGltf('table', `${this.baseUrl}/models/table.gltf`);
		const tableRoot = await MRE.Actor.CreateFromPrefab(this.context, {
			prefabId: ag.prefabs.byIndex(0).id,
			actor: {}
		});
		this.constructBoard(tableRoot);
	}

	public stop() {

	}

	public userJoin(user: MRE.User) {

	}

	public userLeft(user: MRE.User) {

	}

	private constructBoard(tableRoot: MRE.Actor) {
		const tableActor = tableRoot.findChildrenByName('Table', false)[0];
		this.table = new Table(this, tableActor);

		const nametagRoot = tableRoot.findChildrenByName('Nameplates', false)[0];
		const nametagModels = nametagRoot.children.sort((a, b) => a.name < b.name ? -1 : 1);

		this.nametags = [];
		for (const model of nametagModels) {
			this.nametags.push(new Nametag(this, model));
		}
	}
}
