import { Plugin, TFile, TextFileView, Notice } from 'obsidian';

export default class SpaceInsertionPlugin extends Plugin {
	async onload() {
		// 添加一个侧边栏图标
		const ribbonIconEl = this.addRibbonIcon('rectangle-horizontal', 'Insert Spaces', async (evt: MouseEvent) => {
			// 获取当前打开的文件
			let activeFile = this.app.workspace.getActiveFile();
			if (activeFile) {
				const vault = this.app.vault;
				try {
					// 获取活动视图的类型
					let fileView: TextFileView | null = this.app.workspace.getActiveViewOfType(TextFileView);
					if (!fileView) {
						new Notice('Insert Spaces: No active file view');
						return;
					}
					// 保存文件内容
					await fileView.save();
					// 读取文件内容
					let content = await vault.cachedRead(activeFile);
					// 执行空格插入
					content = this.addSpacesBetweenChineseAndNonChinese(content);
					try {
						// 更新文件内容
						await vault.modify(activeFile, content);
					} catch (error) {
						new Notice('Insert Spaces: Error updating file: ' + error);
					}
				} catch (error) {
					new Notice('Insert Spaces: Error reading file: ' + error);
				}
			}
		});
		ribbonIconEl.addClass('space-insertion-plugin-ribbon-class');
	}

	// 插入空格的逻辑
	addSpacesBetweenChineseAndNonChinese(text: string): string {
		return text.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2')
				   .replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2');
	}

	onunload() {
		console.log('unloading Space Insertion plugin');
	}
}
