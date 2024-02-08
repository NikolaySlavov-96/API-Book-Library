exports.confirmRegister = ({ link }) => {
  return (
    `<html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto;">
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="text-align: center;">
                          <span style="font-size: 24px; color: #333; font-family: Helvetica; line-height: 1.5; margin-bottom: 25px;">
                            Book Shop Verify Email address
                          </span>
                          <br></br>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 16px; color: #666; font-family: Helvetica; line-height: 1.5; text-align: left;">
                          Your: ${link}
                        </td>
                      </tr>
                      <tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`
  );
}