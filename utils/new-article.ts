import { join } from 'node:path'

export async function createNewArticle(): Promise<string> {
  // 現在日時を取得
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const dateString = `${year}-${month}-${day}`

  // パスを構築
  const templatePath = './utils/template.md'
  const outputDir = `./src/content/blog/${year}/${month}`
  const outputPath = join(outputDir, `${day}.md`)

  try {
    // ファイルが既に存在するかチェック
    const existingFile = Bun.file(outputPath)
    if (await existingFile.exists()) {
      throw new Error(`ファイルが既に存在します: ${outputPath}`)
    }

    // テンプレートファイルを読み込み
    const templateFile = Bun.file(templatePath)
    const templateContent = await templateFile.text()

    // {DATE} を現在日時に置換
    const newContent = templateContent.replace(/{DATE}/g, dateString)

    // 出力ディレクトリが存在しない場合は作成（Bunのwriteは自動でディレクトリを作成）
    await Bun.write(outputPath, newContent)

    console.log(`新しい記事ファイルが作成されました: ${outputPath}`)
    return outputPath
  } catch (error) {
    console.error('記事ファイルの作成に失敗しました:', error)
    throw error
  }
}

// スクリプトが直接実行された場合
createNewArticle().catch(console.error)
