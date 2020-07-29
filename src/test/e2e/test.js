require('chromedriver')
const assert = require('assert')
const {Builder, Key, By, until} = require('selenium-webdriver')
describe('BP Challenge', () => {
	let driver
	let matrix = []
	let answers = []
	before(async function () {
		driver = await new Builder().forBrowser('chrome').build()
	})

	it('Find and click render button', async () => {
		await driver.get('http://localhost:3000')
		await driver
			.findElement(By.css('button[data-test-id=render-challenge]'))
			.click()
		await driver.findElement(By.id('challenge'))
	})

	it('Find the table and solve the challenge', async () => {
		const rows = await driver.findElements(By.tagName('tr'))
		for (let e of rows) {
			const row = await e.getText()
			const numRow = row.split(' ').map((num) => Number(num))
			matrix.push(numRow)
		}

		matrix.forEach((line) => {
			const idx = findNumBetweenMatchingSums(line)
			answers.push(idx)
		})
	})

	it('Fill out solutions input form and submit', async () => {
		await driver.findElement(By.css('input[data-test-id=submit-1]')).click()
		await driver
			.findElement(By.css('input[data-test-id=submit-1]'))
			.sendKeys(`${answers[0]}`)
		await driver.findElement(By.css('input[data-test-id=submit-2]')).click()
		await driver
			.findElement(By.css('input[data-test-id=submit-2]'))
			.sendKeys(`${answers[1]}`)
		await driver.findElement(By.css('input[data-test-id=submit-3]')).click()
		await driver
			.findElement(By.css('input[data-test-id=submit-3]'))
			.sendKeys(`${answers[2]}`)
		await driver.findElement(By.css('input[data-test-id=submit-4]')).click()
		await driver
			.findElement(By.css('input[data-test-id=submit-4]'))
			.sendKeys('Andre Birkus')

		const btn = await driver
			.findElement(By.css('button[data-test-id=final-submit]'))
			.click()
	})

	after(() => driver && driver.quit())
})

const findNumBetweenMatchingSums = (arr) => {
	let sum1 = 0
	let sum2 = 1
	let splitIndex = 1
	while (sum1 !== sum2 && splitIndex !== arr.length - 1) {
		let leftArr = [...arr]
		let rightArr = leftArr.splice(splitIndex)
		rightArr.shift()
		sum1 = leftArr.reduce((a, b) => a + b)
		sum2 = rightArr.reduce((a, b) => a + b)
		if (sum1 === sum2) return splitIndex
		splitIndex++
	}

	return null
}
