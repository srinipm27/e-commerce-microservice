/* tslint:disable no-unused-expression */
import { browser } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import ProductComponentsPage from './product.page-object';
import { ProductDeleteDialog } from './product.page-object';
import ProductUpdatePage from './product-update.page-object';
import path from 'path';

const expect = chai.expect;

describe('Product e2e test', () => {
  let navBarPage: NavBarPage;
  let productUpdatePage: ProductUpdatePage;
  let productComponentsPage: ProductComponentsPage;
  let productDeleteDialog: ProductDeleteDialog;
  const fileToUpload = '../../../../../main/webapp/static/images/logo-jhipster.png';
  const absolutePath = path.resolve(__dirname, fileToUpload);

  before(() => {
    browser.get('/');
    navBarPage = new NavBarPage();
    navBarPage.autoSignIn();
  });

  it('should load Products', async () => {
    navBarPage.getEntityPage('product');
    productComponentsPage = new ProductComponentsPage();
    expect(await productComponentsPage.getTitle().getText()).to.match(/Products/);
  });

  it('should load create Product page', async () => {
    productComponentsPage.clickOnCreateButton();
    productUpdatePage = new ProductUpdatePage();
    expect(await productUpdatePage.getPageTitle().getAttribute('id')).to.match(/storeApp.product.home.createOrEditLabel/);
  });

  it('should create and save Products', async () => {
    const nbButtonsBeforeCreate = await productComponentsPage.countDeleteButtons();

    productUpdatePage.setNameInput('name');
    expect(await productUpdatePage.getNameInput()).to.match(/name/);
    productUpdatePage.setDescriptionInput('description');
    expect(await productUpdatePage.getDescriptionInput()).to.match(/description/);
    productUpdatePage.setPriceInput('5');
    expect(await productUpdatePage.getPriceInput()).to.eq('5');
    productUpdatePage.sizeSelectLastOption();
    productUpdatePage.setImageInput(absolutePath);
    productUpdatePage.productCategorySelectLastOption();
    await productUpdatePage.save();
    expect(await productUpdatePage.getSaveButton().isPresent()).to.be.false;

    productComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await productComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Product', async () => {
    productComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await productComponentsPage.countDeleteButtons();
    await productComponentsPage.clickOnLastDeleteButton();

    productDeleteDialog = new ProductDeleteDialog();
    expect(await productDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/storeApp.product.delete.question/);
    await productDeleteDialog.clickOnConfirmButton();

    productComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await productComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(() => {
    navBarPage.autoSignOut();
  });
});
