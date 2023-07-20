import { test, expect } from '@playwright/test';
import { seed } from '../src/seed.js';
import { Operation, History } from '../src/models.js'
import { error } from 'console';

test.describe('test', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async () => {
    await seed();
  })

  test('Deberia tener como titulo de pagina recalc', async ({ page }) => {
    await page.goto('./');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/recalc/i);
  });

  test('Deberia poder realizar una resta', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '7' }).click()
    await page.getByRole('button', { name: '9' }).click()
    await page.getByRole('button', { name: '-' }).click()
    await page.getByRole('button', { name: '9' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/sub/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(70);

    await expect(page.getByTestId('display')).toHaveValue(/70/)

    const operation = await Operation.findOne({
      where: {
        name: "SUB"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(79)
    expect(historyEntry.secondArg).toEqual(9)
    expect(historyEntry.result).toEqual(70)
  });

  test('Deberia poder realizar una suma', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '7' }).click()
    await page.getByRole('button', { name: '0' }).click()
    await page.getByRole('button', { name: '+' }).click()
    await page.getByRole('button', { name: '9' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/add/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(79);

    await expect(page.getByTestId('display')).toHaveValue(/79/)

    const operation = await Operation.findOne({
      where: {
        name: "ADD"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(70)
    expect(historyEntry.secondArg).toEqual(9)
    expect(historyEntry.result).toEqual(79)
  });

  test('Deberia poder realizar una multiplicacion', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '1' }).click()
    await page.getByRole('button', { name: '0' }).click()
    await page.getByRole('button', { name: '*' }).click()
    await page.getByRole('button', { name: '5' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/mul/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(50);

    await expect(page.getByTestId('display')).toHaveValue(/50/)

    const operation = await Operation.findOne({
      where: {
        name: "MUL"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(10)
    expect(historyEntry.secondArg).toEqual(5)
    expect(historyEntry.result).toEqual(50)
  });  

   test('Deberia poder realizar una potencia', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '7' }).click()
    await page.getByRole('button', { name: '^2' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/pow/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(49);

    await expect(page.getByTestId('display')).toHaveValue(/49/)

    const operation = await Operation.findOne({
      where: {
        name: "POW"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })
    expect(historyEntry.firstArg).toEqual(7)
    expect(historyEntry.result).toEqual(49)
  });

  test('Deberia poder realizar una división', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '9' }).click()
    await page.getByRole('button', { name: '0' }).click()
    await page.getByRole('button', { name: '/' }).click()
    await page.getByRole('button', { name: '9' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/div/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(10);

    await expect(page.getByTestId('display')).toHaveValue(/10/)

    const operation = await Operation.findOne({
      where: {
        name: "DIV"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(90)
    expect(historyEntry.secondArg).toEqual(9)
    expect(historyEntry.result).toEqual(10)
  });

  test('Deberia poder realizar la raiz cuadrada', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '9' }).click()
    await page.getByRole('button', { name: 'square' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/sqrt/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(3);

    await expect(page.getByTestId('display')).toHaveValue(/3/)

    const operation = await Operation.findOne({
      where: {
        name: "SQRT"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(9)
    expect(historyEntry.result).toEqual(3)
  });

  test('Deberia poder ingresar un numero dar click en igual y que no devuelva undefined', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '8' }).click()
    await page.getByRole('button', { name: '=' }).click()

    await expect(page.getByTestId('display')).toHaveValue(/8/)

  });
  
    test('Debria poder borrar una cuenta de la interfaz con C', async ({ page }) => {
      await page.goto('./');
  
      await page.getByRole('button', { name: '9' }).click()
      await page.getByRole('button', { name: '0' }).click()
      await page.getByRole('button', { name: '/' }).click()
      await page.getByRole('button', { name: 'c' }).click()
  
      await expect(page.getByTestId('display')).toHaveValue(/0/)
    });
  
    test('Deberia poder realizar una conversion de decimal a binario', async ({ page }) => {
      await page.goto('./');
  
      await page.getByRole('button', { name: '9' }).click()
      await page.getByRole('button', { name: 'binary' }).click()
  
      const [response] = await Promise.all([
        page.waitForResponse((r) => r.url().includes('/api/v1/binary/')),
        page.getByRole('button', { name: '=' }).click()
      ]);
  
      const { result } = await response.json();
      expect(result).toBe(1001);
  
      await expect(page.getByTestId('display')).toHaveValue(/1001/)
  
      const operation = await Operation.findOne({
        where: {
          name: "BINARY"
        }
      });
  
      const historyEntry = await History.findOne({
        where: { OperationId: operation.id }
      })
  
      expect(historyEntry.firstArg).toEqual(9)
      expect(historyEntry.result).toEqual(1001)
    });

    test('Deberia realizar una resta con numeros negativos', async ({ page }) => {
      await page.goto('./');
    
      await page.getByRole('button', { name: '-' }).click()
      await page.getByRole('button', { name: '6' }).click()
      await page.getByRole('button', { name: '3' }).click()
      await page.getByRole('button', { name: '-' }).click()
      await page.getByRole('button', { name: '3' }).click()
    
      const [response] = await Promise.all([
        page.waitForResponse((r) => r.url().includes('/api/v1/sub/')),
        page.getByRole('button', { name: '=' }).click()
      ]);
    
      const { result } = await response.json();
      expect(result).toBe(-66);
    
      await expect(page.getByTestId('display')).toHaveValue(/-66/)
    
      const operation = await Operation.findOne({
        where: {
          name: "SUB"
        }
      });
    
      const historyEntry = await History.findOne({
        where: { OperationId: operation.id }
      })
    
      expect(historyEntry.firstArg).toEqual(-63)
      expect(historyEntry.secondArg).toEqual(3)
      expect(historyEntry.result).toEqual(-66)
    });

    test('Deberia lanzar un error cuando se quiere realizar una potencia con un numero mayor a 100000', async ({ page }) => {
      await page.goto('./');
  
      await page.getByRole('button', { name: '9' }).click()
      await page.getByRole('button', { name: '9' }).click()
      await page.getByRole('button', { name: '9' }).click()
      await page.getByRole('button', { name: '9' }).click()
      await page.getByRole('button', { name: '9' }).click()
      await page.getByRole('button', { name: '9' }).click()
      await page.getByRole('button', { name: '^2' }).click()
  
        page.getByRole('button', { name: '=' }).click()
  
        await expect(page.getByTestId('display')).toHaveValue("error")

    });
    
    test('Deberia lanzar un error cuando se quiere realizar una division por cero', async ({ page }) => {
      await page.goto('./');

      await page.getByRole('button', { name: '5' }).click()
      await page.getByRole('button', { name: '/' }).click()
      await page.getByRole('button', { name: '0' }).click()

        page.getByRole('button', { name: '=' }).click()

        await expect(page.getByTestId('display')).toHaveValue("Math error")

    });
})