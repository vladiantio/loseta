import type { Example } from "./types";
import { moreHorizontal } from "./icons";

export const tableExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="table-container">
  <table class="table">
    <caption>A list of your recent invoices.</caption>
    <thead>
      <tr>
        <th scope="col">Invoice</th>
        <th scope="col">Status</th>
        <th scope="col">Method</th>
        <th scope="col" style="text-align: end">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>INV-001</td>
        <td>Paid</td>
        <td>Credit card</td>
        <td style="text-align: end">$250.00</td>
      </tr>
      <tr>
        <td>INV-002</td>
        <td>Pending</td>
        <td>PayPal</td>
        <td style="text-align: end">$150.00</td>
      </tr>
      <tr>
        <td>INV-003</td>
        <td>Unpaid</td>
        <td>Bank transfer</td>
        <td style="text-align: end">$350.00</td>
      </tr>
    </tbody>
  </table>
</div>`
    },
    {
      title: "Footer",
      html: `<div class="table-container">
  <table class="table">
    <caption>A list of your recent invoices.</caption>
    <thead>
      <tr>
        <th scope="col">Invoice</th>
        <th scope="col">Status</th>
        <th scope="col">Method</th>
        <th scope="col" style="text-align: end">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>INV-001</td>
        <td>Paid</td>
        <td>Credit card</td>
        <td style="text-align: end">$250.00</td>
      </tr>
      <tr>
        <td>INV-002</td>
        <td>Pending</td>
        <td>PayPal</td>
        <td style="text-align: end">$150.00</td>
      </tr>
      <tr>
        <td>INV-003</td>
        <td>Unpaid</td>
        <td>Bank transfer</td>
        <td style="text-align: end">$350.00</td>
      </tr>
      <tr>
        <td>INV-004</td>
        <td>Paid</td>
        <td>Credit card</td>
        <td style="text-align: end">$450.00</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th scope="row" colspan="3">Total</th>
        <td style="text-align: end">$1,200.00</td>
      </tr>
    </tfoot>
  </table>
</div>`
    },
    {
      title: "Actions",
      html: `<div class="table-container">
  <table class="table">
    <caption>Products and their current prices.</caption>
    <thead>
      <tr>
        <th scope="col">Product</th>
        <th scope="col" style="text-align: end">Price</th>
        <th scope="col"><span class="sr-only">Actions</span></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Wireless Mouse</td>
        <td style="text-align: end">$29.99</td>
        <td>
          <div class="dropdown-menu" data-demo="dropdown">
            <button type="button" class="btn" data-variant="ghost" data-size="icon-sm" aria-haspopup="menu" aria-expanded="false" aria-label="Open menu for Wireless Mouse">${moreHorizontal}</button>
            <div data-popover data-side="top" data-align="end" aria-hidden="true">
              <div role="menu">
                <button type="button" role="menuitem">Edit</button>
                <button type="button" role="menuitem">Duplicate</button>
                <div role="separator"></div>
                <button type="button" role="menuitem" data-variant="destructive">Delete</button>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>Mechanical Keyboard</td>
        <td style="text-align: end">$129.99</td>
        <td>
          <div class="dropdown-menu" data-demo="dropdown">
            <button type="button" class="btn" data-variant="ghost" data-size="icon-sm" aria-haspopup="menu" aria-expanded="false" aria-label="Open menu for Mechanical Keyboard">${moreHorizontal}</button>
            <div data-popover data-side="top" data-align="end" aria-hidden="true">
              <div role="menu">
                <button type="button" role="menuitem">Edit</button>
                <button type="button" role="menuitem">Duplicate</button>
                <div role="separator"></div>
                <button type="button" role="menuitem" data-variant="destructive">Delete</button>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>USB-C Hub</td>
        <td style="text-align: end">$49.99</td>
        <td>
          <div class="dropdown-menu" data-demo="dropdown">
            <button type="button" class="btn" data-variant="ghost" data-size="icon-sm" aria-haspopup="menu" aria-expanded="false" aria-label="Open menu for USB-C Hub">${moreHorizontal}</button>
            <div data-popover data-side="top" data-align="end" aria-hidden="true">
              <div role="menu">
                <button type="button" role="menuitem">Edit</button>
                <button type="button" role="menuitem">Duplicate</button>
                <div role="separator"></div>
                <button type="button" role="menuitem" data-variant="destructive">Delete</button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>`
    },
    {
      title: "Selection",
      html: `<div class="table-container">
  <table class="table">
    <caption>Select invoices to export.</caption>
    <thead>
      <tr>
        <th scope="col"><input class="checkbox" type="checkbox" aria-label="Select all invoices" data-demo-indeterminate></th>
        <th scope="col">Invoice</th>
        <th scope="col">Status</th>
        <th scope="col" style="text-align: end">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr aria-selected="true">
        <td><input class="checkbox" type="checkbox" aria-label="Select INV-001" checked></td>
        <td>INV-001</td>
        <td><span class="badge" data-variant="outline">Paid</span></td>
        <td style="text-align: end">$250.00</td>
      </tr>
      <tr>
        <td><input class="checkbox" type="checkbox" aria-label="Select INV-002"></td>
        <td>INV-002</td>
        <td><span class="badge" data-variant="secondary">Pending</span></td>
        <td style="text-align: end">$150.00</td>
      </tr>
      <tr>
        <td><input class="checkbox" type="checkbox" aria-label="Select INV-003"></td>
        <td>INV-003</td>
        <td><span class="badge" data-variant="destructive">Unpaid</span></td>
        <td style="text-align: end">$350.00</td>
      </tr>
    </tbody>
  </table>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="table-container" dir="rtl" lang="ar">
  <table class="table">
    <caption>قائمة بفواتيرك الأخيرة.</caption>
    <thead>
      <tr>
        <th scope="col">الفاتورة</th>
        <th scope="col">الحالة</th>
        <th scope="col">الطريقة</th>
        <th scope="col" style="text-align: end">المبلغ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>INV-001</td>
        <td>مدفوع</td>
        <td>بطاقة ائتمانية</td>
        <td style="text-align: end">$250.00</td>
      </tr>
      <tr>
        <td>INV-002</td>
        <td>قيد الانتظار</td>
        <td>PayPal</td>
        <td style="text-align: end">$150.00</td>
      </tr>
      <tr>
        <td>INV-003</td>
        <td>غير مدفوع</td>
        <td>تحويل بنكي</td>
        <td style="text-align: end">$350.00</td>
      </tr>
    </tbody>
  </table>
</div>`
    }
];
