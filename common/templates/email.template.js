export const emailTemplate = ({ purpose, otp, expireIn }) => {
  return ` 
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABADY - Verification Code</title>
</head>

<body style="margin:0;padding:0;background-color:#09090B;font-family:Arial,Helvetica,sans-serif;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color:#09090B;padding:40px 12px;">
        <tr>
            <td align="center">

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="max-width:480px;background-color:#18181B;border:1px solid #3F3F46;border-radius:18px;">

                    <!-- Brand & Logo -->
                    <tr>
                        <td align="center" style="padding:32px 20px 12px;">

                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td valign="middle" style="padding-right:14px;">
                                        <img
                                            src="cid:brand-logo"
                                            alt="ABADY Logo"
                                            width="54"
                                            height="54"
                                            style="display:block;width:54px;height:54px;border:0;border-radius:13px;"
                                        />
                                    </td>

                                    <td valign="middle" align="left">
                                        <div style="font-size:29px;font-weight:800;letter-spacing:5px;color:#FAFAFA;line-height:1.2;">
                                            ABADY
                                        </div>

                                        <div style="margin-top:6px;font-size:9px;letter-spacing:2.5px;color:#A1A1AA;">
                                            ACCOUNT SECURITY
                                        </div>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding:25px 25px 0;color:#FAFAFA;">
                            <h1 style="margin:0;font-size:25px;line-height:1.4;">
                                ${purpose}
                            </h1>
                        </td>
                    </tr>

                    <!-- Description -->
                    <tr>
                        <td align="center"
                            style="padding:16px 30px 25px;color:#C4C4CC;font-size:14px;line-height:1.8;">
                            Use the verification code below to complete your request securely.
                            If you didn't request this action, you can safely ignore this email.
                        </td>
                    </tr>

                    <!-- OTP -->
                    <tr>
                        <td align="center" style="padding:0 25px 25px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                                style="background-color:#27272A;border:1px solid #52525B;border-radius:12px;">
                                <tr>
                                    <td align="center"
                                        style="padding:20px 30px;color:#FFFFFF;font-size:34px;font-weight:700;letter-spacing:9px;">
                                        ${otp}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Expiry -->
                    <tr>
                        <td align="center"
                            style="padding:0 25px 30px;color:#C4C4CC;font-size:13px;line-height:1.9;">
                            This code expires in
                            <strong style="color:#FFFFFF;">${expireIn} minutes</strong>.
                            <br>
                            Never share this code with anyone.
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding:0 25px;">
                            <div style="height:1px;background-color:#3F3F46;"></div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center"
                            style="padding:22px 20px 28px;color:#A1A1AA;font-size:11px;line-height:1.9;">
                            This is an automated security message from Omar Abady.
                            <br>
                            Please do not reply to this email.
                            <br><br>
                            &copy; ${new Date().getFullYear()} ABADY. All rights reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
`;
};
