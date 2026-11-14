import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTHOR_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  sanitizePlainText,
  validateWishInput,
} from './wishesValidation';

test('sanitizePlainText strips HTML tags and collapses excessive spaces', () => {
  const dirty = '  <script>alert(1)</script>Chúc   <b>thầy</b> nhiều sức khỏe!  ';
  assert.equal(sanitizePlainText(dirty), 'alert(1)Chúc thầy nhiều sức khỏe!');
});

test('validateWishInput defaults empty author to Ẩn danh', () => {
  const res = validateWishInput({
    author: '   ',
    message: 'Chúc cô luôn vui vẻ và hạnh phúc trong ngày 20/11.',
  });
  assert.equal(res.ok, true);
  assert.equal(res.author, 'Ẩn danh');
});

test('validateWishInput rejects empty or too-short messages', () => {
  assert.equal(validateWishInput({ author: 'Lan', message: '   ' }).ok, false);
  assert.equal(validateWishInput({ author: 'Lan', message: 'Hi' }).ok, false);
});

test('validateWishInput rejects oversized messages and author names', () => {
  const tooLongMsg = 'a'.repeat(MESSAGE_MAX_LENGTH + 1);
  assert.equal(validateWishInput({ author: 'Lan', message: tooLongMsg }).ok, false);

  const tooLongAuthor = 'A'.repeat(AUTHOR_MAX_LENGTH + 1);
  assert.equal(
    validateWishInput({ author: tooLongAuthor, message: 'Chúc thầy cô 20/11 thật vui ạ!' }).ok,
    false
  );
});

test('validateWishInput blocks URL spam and long repeated characters', () => {
  assert.equal(
    validateWishInput({ author: 'Spam', message: 'Vào ngay https://spam-link.example để nhận quà' }).ok,
    false
  );
  assert.equal(
    validateWishInput({ author: 'Spam', message: 'Chúc mừnggggggggggggggggg thầy cô' }).ok,
    false
  );
});
