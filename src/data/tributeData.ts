/**
 * ============================================================================
 * TỆP DỮ LIỆU TRUNG TÂM — DỄ DÀNG CHỈNH SỬA CHO TẬP THỂ LỚP
 * ============================================================================
 * Hướng dẫn thay thế:
 * 1. Tìm các dòng đánh dấu [THAY THẾ TẠI ĐÂY] để điền tên lớp, tên trường,
 *    tên thầy cô, ảnh kỷ niệm, lời chúc và thư tri ân thật của lớp bạn.
 * 2. Để thay ảnh: chép ảnh vào thư mục /public/assets/images/ và sửa đường dẫn
 *    bên dưới thành '/assets/images/ten-anh.jpg'.
 * 3. Để thay video: chép file MP4 vào /public/assets/videos/class-memories.mp4
 *    và bật hasLocalVideo = true hoặc cập nhật videoSrc.
 * ============================================================================
 */

export interface TeacherProfile {
  id: string;
  name: string;
  titlePrefix: string;
  subject: string;
  yearsTogether: string;
  image: string;
  shortWish: string;
  memorableStory: string;
  letter: string[];
  accentTone: 'pine' | 'amber' | 'terracotta' | 'slate';
}

export interface MemoryPhoto {
  id: string;
  title: string;
  caption: string;
  dateLabel: string;
  category: 'Lớp học' | 'Hoạt động' | 'Cùng thầy cô';
  image: string;
  aspect: 'landscape' | 'portrait' | 'square';
}

export interface JourneyMilestone {
  id: string;
  chapter: string;
  period: string;
  title: string;
  description: string;
  gratitudeNote: string;
  image: string;
}

export interface SeedWish {
  id: string;
  author: string;
  message: string;
  created_at: string;
}

export const CLASS_INFO = {
  // [THAY THẾ TẠI ĐÂY] Chủ đề & thông tin lớp
  themeTitle: 'Dư Âm Bảng Phấn',
  themeSubtitle: 'Mùa Hiến Chương Nhà Giáo 20/11',
  className: 'Tập thể 12C3', // [THAY THẾ TẠI ĐÂY] Tên lớp của bạn
  schoolName: 'Trường THPT Bình Sơn', // [THAY THẾ TẠI ĐÂY] Tên trường
  academicYears: 'Niên khóa 2023 – 2026', // [THAY THẾ TẠI ĐÂY] Niên khóa
  heroImage: '/src/assets/images/hero_classroom_sunlight_1794662289206.jpg',
  heroLead:
    'Có những buổi chiều nắng hắt qua khung cửa gỗ, tiếng phấn rơi khe khẽ trên bục giảng và những lời dặn dò lặng lẽ đã trở thành hành trang đẹp nhất suốt năm tháng thanh xuân của chúng em.',
  introQuote:
    '“Có một nghề bụi phấn bám đầy tay, người ta bảo đó là nghề trong sạch nhất.”',
  introSubtext:
    'Trang lưu bút điện tử của 42 thành viên gửi trọn lòng biết ơn đến thầy cô — những người đã kiên nhẫn gieo hạt nắng đầu tiên cho ước mơ chúng em nảy mầm.',
};

export const TEACHERS_LIST: TeacherProfile[] = [
  {
    id: 'teacher-toan',
    name: 'Thầy Thoại',
    titlePrefix: 'Thầy',
    subject: 'Toán Học',
    yearsTogether: 'Gắn bó 3 năm',
    image: '/src/assets/images/teacher_portrait_literature_1794662290415.jpg',
    shortWish:
      'Kính chúc thầy luôn dồi dào sức khỏe, vững vàng tay phấn và mãi giữ nụ cười hiền hậu sau mỗi giờ giải đề.',
    memorableStory:
      'Suốt ba năm liền đồng hành cùng lớp, dù bài toán có hóc búa đến đâu thầy vẫn kiên nhẫn giảng đi giảng lại đến khi cả phòng học đều gật đầu hiểu bài.',
    letter: [
      'Thầy Thoại kính mến,',
      'Ba năm gắn bó cùng thầy là ba năm chúng em trưởng thành từ những bài toán đầu tiên còn nhiều lúng túng đến khi tự tin bước vào phòng thi cuối cấp.',
      'Cảm ơn thầy vì sự tận tâm, những lời nhắc nhở nghiêm khắc đúng lúc và tấm lòng luôn hết mình vì học trò. Chúc thầy ngày 20/11 thật nhiều niềm vui và sức khỏe!',
    ],
    accentTone: 'pine',
  },
  {
    id: 'teacher-anh',
    name: 'Cô Thảo',
    titlePrefix: 'Cô',
    subject: 'Tiếng Anh',
    yearsTogether: 'Đồng hành 2 năm',
    image: '/src/assets/images/teacher_portrait_math_1794662290249.jpg',
    shortWish:
      'Chúc cô mãi tươi trẻ, tràn đầy năng lượng và có thật nhiều giờ học rộn rã tiếng cười cùng học trò.',
    memorableStory:
      'Buổi thuyết trình tiếng Anh đầu tiên cả lớp còn rụt rè, cô đã đứng cuối lớp mỉm cười vỗ tay cổ vũ khiến ai cũng tự tin nói trọn phần của mình.',
    letter: [
      'Cô Thảo thân thương,',
      'Hai năm học cùng cô, tiếng Anh không còn là nỗi lo mà trở thành những tiết học sinh động đầy hứng khởi và ấm áp.',
      'Kính chúc cô một mùa 20/11 thật rạng rỡ, bình an và gặt hái thật nhiều thành công trong sự nghiệp trồng người.',
    ],
    accentTone: 'amber',
  },
  {
    id: 'teacher-van',
    name: 'Cô Quyên',
    titlePrefix: 'Cô',
    subject: 'Ngữ Văn',
    yearsTogether: 'Đồng hành 2 năm',
    image: '/src/assets/images/homeroom_teacher_portrait_1794662289452.jpg',
    shortWish:
      'Kính chúc cô luôn giữ được giọng giảng truyền cảm và trái tim ấm áp qua từng trang văn đẹp.',
    memorableStory:
      'Những buổi chiều phân tích tác phẩm văn học, giọng cô nhẹ nhàng đưa cả lớp đi qua biết bao cung bậc cảm xúc và dạy chúng em biết sống sâu sắc hơn.',
    letter: [
      'Cô Quyên kính yêu,',
      'Hai năm được nghe cô giảng Văn là khoảng thời gian chúng em học được cách rung động trước cái đẹp của ngôn từ và lòng nhân hậu trong đời sống.',
      'Chúc cô luôn khỏe mạnh, an yên và mãi là người gieo mầm yêu thương cho nhiều thế hệ học sinh.',
    ],
    accentTone: 'terracotta',
  },
  {
    id: 'teacher-su',
    name: 'Thầy Hải',
    titlePrefix: 'Thầy',
    subject: 'Lịch Sử',
    yearsTogether: 'Đồng hành 2 năm',
    image: '/src/assets/images/teacher_portrait_literature_1794662290415.jpg',
    shortWish:
      'Chúc thầy luôn khỏe mạnh để tiếp tục kể những trang sử hào hùng bằng tất cả nhiệt huyết và sự dí dỏm.',
    memorableStory:
      'Những câu chuyện lịch sử qua lời kể sinh động của thầy luôn khiến cả lớp lắng nghe say mê, quên mất tiếng chuông báo hết tiết.',
    letter: [
      'Thầy Hải kính mến,',
      'Từ những bài giảng suốt hai năm qua, chúng em không chỉ nhớ các mốc thời gian mà còn học được lòng biết ơn quá khứ và trách nhiệm với tương lai.',
      'Xin gửi tới thầy lời tri ân chân thành nhất nhân Ngày Nhà giáo Việt Nam 20/11.',
    ],
    accentTone: 'slate',
  },
  {
    id: 'teacher-gdqp',
    name: 'Thầy Linh',
    titlePrefix: 'Thầy',
    subject: 'GDQP & AN',
    yearsTogether: 'Đồng hành 2 năm',
    image: '/src/assets/images/teacher_portrait_literature_1794662290415.jpg',
    shortWish:
      'Kính chúc thầy luôn rắn rỏi, vui tính và giữ mãi tinh thần nhiệt thành trên sân tập cùng học trò.',
    memorableStory:
      'Những giờ học điều lệnh ngoài sân nắng chang chang nhưng luôn đầy tiếng cười nhờ sự hài hước và quan tâm của thầy dành cho từng thành viên.',
    letter: [
      'Thầy Linh kính mến,',
      'Hai năm học GDQP cùng thầy giúp chúng em rèn luyện tính kỷ luật, tinh thần đồng đội và có thêm thật nhiều kỷ niệm đáng nhớ ngoài sân trường.',
      'Chúc thầy ngày 20/11 thật nhiều sức khỏe, niềm vui và hạnh phúc bên gia đình.',
    ],
    accentTone: 'pine',
  },
  {
    id: 'teacher-tin',
    name: 'Thầy Thủy',
    titlePrefix: 'Thầy',
    subject: 'Tin Học',
    yearsTogether: 'Đồng hành 1 năm',
    image: '/src/assets/images/teacher_portrait_literature_1794662290415.jpg',
    shortWish:
      'Chúc thầy luôn tràn đầy năng lượng, nhiệt huyết và truyền cảm hứng sáng tạo công nghệ cho thật nhiều lứa học trò.',
    memorableStory:
      'Dù mới đồng hành 1 năm, thầy luôn tận tình sửa từng lỗi nhỏ trong phòng máy và khuyến khích cả lớp mạnh dạn thử những ý tưởng mới.',
    letter: [
      'Thầy Thủy kính mến,',
      'Cảm ơn thầy vì sự kiên nhẫn hướng dẫn từng bước thực hành và sự gần gũi mỗi khi chúng em gặp khó khăn với bài tập Tin học.',
      'Kính chúc thầy một mùa 20/11 thật ấm áp, nhiều sức khỏe và niềm vui.',
    ],
    accentTone: 'amber',
  },
  {
    id: 'teacher-hoa',
    name: 'Cô Bông',
    titlePrefix: 'Cô',
    subject: 'Hóa Học',
    yearsTogether: 'Đồng hành 1 năm',
    image: '/src/assets/images/teacher_portrait_math_1794662290249.jpg',
    shortWish:
      'Kính chúc cô luôn tươi trẻ, rạng rỡ và giữ mãi ngọn lửa yêu nghề trong từng tiết Hóa học.',
    memorableStory:
      'Một năm học cùng cô tuy chưa dài nhưng từng phương trình phản ứng và lời dặn dò tỉ mỉ của cô đã giúp cả lớp thêm tự tin và yêu thích môn Hóa hơn.',
    letter: [
      'Cô Bông kính yêu,',
      'Cảm ơn cô đã luôn nhẹ nhàng giảng giải từ những kiến thức căn bản đến các dạng bài nâng cao để ai trong lớp cũng theo kịp.',
      'Chúc cô ngày Nhà giáo Việt Nam 20/11 tràn ngập hoa tươi và những lời chúc tốt đẹp nhất.',
    ],
    accentTone: 'terracotta',
  },
  {
    id: 'teacher-cncn',
    name: 'Thầy Thanh',
    titlePrefix: 'Thầy',
    subject: 'Công Nghệ (CNCN)',
    yearsTogether: 'Đồng hành 2 năm',
    image: '/src/assets/images/teacher_portrait_literature_1794662290415.jpg',
    shortWish:
      'Kính chúc thầy luôn mạnh khỏe, vui vẻ và có thêm thật nhiều tiết học thực tế bổ ích cùng học sinh.',
    memorableStory:
      'Hai năm qua, những ví dụ thực tiễn gần gũi trong giờ Công nghệ của thầy luôn giúp tụi em hiểu rõ hơn cách vận dụng kiến thức vào đời sống.',
    letter: [
      'Thầy Thanh kính mến,',
      'Cảm ơn thầy đã luôn tận tụy, hiền hòa và hết lòng chỉ bảo cho tập thể lớp trong suốt hai năm gắn bó.',
      'Nhân dịp 20/11, chúng em kính chúc thầy thật nhiều sức khỏe, bình an và thành công.',
    ],
    accentTone: 'slate',
  },
  {
    id: 'teacher-ly-gvcn',
    name: 'Cô Huyền',
    titlePrefix: 'Cô',
    subject: 'Vật Lý · GVCN',
    yearsTogether: 'Đồng hành 1 năm',
    image: '/src/assets/images/homeroom_teacher_portrait_1794662289452.jpg',
    shortWish:
      'Kính chúc cô chủ nhiệm luôn thật nhiều sức khỏe, bình an và mãi là điểm tựa dịu dàng của 12C3.',
    memorableStory:
      'Dù đồng hành cùng lớp 1 năm cuối cấp đầy áp lực, cô luôn vừa là người dạy Vật Lý tận tâm vừa là người mẹ dịu dàng lắng nghe mọi tâm tư của cả lớp.',
    letter: [
      'Cô Huyền kính yêu,',
      'Cảm ơn cô đã đến bên 12C3 trong năm học quan trọng nhất, vừa truyền đạt những định luật Vật Lý sáng rõ vừa chăm lo cho từng thành viên như người nhà.',
      'Mời cô xem thêm không gian đặc biệt mà cả lớp dành riêng cho cô ở phần tiếp theo nhé!',
    ],
    accentTone: 'pine',
  },
];

export const CLASS_MEMORIES: MemoryPhoto[] = [
  {
    id: 'mem-1',
    title: 'Nắng sớm phòng học tầng hai',
    caption: 'Khoảnh khắc bình yên trước giờ vào lớp, nơi 42 chiếc bàn gỗ lưu giữ biết bao tiếng cười.',
    dateLabel: 'Tháng 09 · Năm học 2024',
    category: 'Lớp học',
    image: '/src/assets/images/hero_classroom_sunlight_1794662289206.jpg',
    aspect: 'landscape',
  },
  {
    id: 'mem-2',
    title: 'Dưới tán phượng sân trường',
    caption: 'Giờ ra chơi rộn rã tiếng trò chuyện dưới hàng phượng vĩ đỏ rực góc sân.',
    dateLabel: 'Tháng 05 · Mùa hạ 2025',
    category: 'Hoạt động',
    image: '/src/assets/images/memory_class_yard_1794662291903.jpg',
    aspect: 'landscape',
  },
  {
    id: 'mem-3',
    title: 'Bó hoa cúc họa mi trên bục giảng',
    caption: 'Bó hoa nhỏ cả lớp bí mật chuẩn bị từ sáng sớm để tạo bất ngờ cho cô trong ngày 20/11.',
    dateLabel: '20/11 · Kỷ niệm khó quên',
    category: 'Cùng thầy cô',
    image: '/src/assets/images/memory_chalkboard_farewell_1794662291819.jpg',
    aspect: 'landscape',
  },
  {
    id: 'mem-4',
    title: 'Ánh nhìn dịu dàng bên khung cửa',
    caption: 'Cô Huyền dừng lại vài phút bên hành lang trước giờ sinh hoạt cuối tuần.',
    dateLabel: 'Tháng 11 · Năm học cuối cấp',
    category: 'Cùng thầy cô',
    image: '/src/assets/images/homeroom_teacher_portrait_1794662289452.jpg',
    aspect: 'portrait',
  },
  {
    id: 'mem-5',
    title: 'Góc thư viện buổi trưa',
    caption: 'Thầy và nhóm học sinh đội tuyển cùng nhau ôn luyện cho kỳ thi học sinh giỏi.',
    dateLabel: 'Tháng 01 · Mùa xuân 2025',
    category: 'Cùng thầy cô',
    image: '/src/assets/images/teacher_portrait_literature_1794662290415.jpg',
    aspect: 'square',
  },
  {
    id: 'mem-6',
    title: 'Giờ học cuối tuần',
    caption: 'Những trang vở ghi chép cẩn thận và nét chữ quen thuộc trên bảng xanh mỗi sáng thứ Sáu.',
    dateLabel: 'Tháng 03 · Thanh xuân 12C3',
    category: 'Lớp học',
    image: '/src/assets/images/teacher_portrait_math_1794662290249.jpg',
    aspect: 'square',
  },
];

export const HOMEROOM_TEACHER = {
  // Thông tin cô giáo chủ nhiệm
  name: 'Cô Huyền',
  role: 'Giáo viên Chủ nhiệm Lớp 12C3 · Bộ môn Vật Lý',
  yearsLabel: 'Người mẹ thứ hai đồng hành cùng lớp suốt 1 năm đáng nhớ',
  portrait: '/src/assets/images/homeroom_teacher_portrait_1794662289452.jpg',
  highlightQuote:
    '“Chỉ một năm đồng hành thôi cũng đủ để chúng em mang theo tình thương của cô suốt cả quãng đường trưởng thành.”',
  letterSubject: 'Gửi Cô Huyền — Người giữ ngọn đèn ấm nhất thanh xuân 12C3',
  letterSalutation: 'Cô Huyền kính yêu của chúng em,',
  letterDate: 'Mùa Hiến chương 20/11 · Từ tập thể học trò lớp 12C3',
  letterParagraphs: [
    'Nếu có ai hỏi điều gì khiến năm học gắn bó cùng cô trở nên dịu dàng và đáng nhớ đến vậy, câu trả lời của tất cả chúng em chắc chắn bắt đầu từ sự tận tâm của cô Huyền.',
    'Dù chỉ đồng hành cùng tập thể lớp một năm học và trực tiếp giảng dạy bộ môn Vật Lý, ngay từ những ngày đầu tiên nhận lớp, cô đã bước vào bằng tất cả sự ấm áp và gần gũi. Nhờ có cô, những buổi học với công thức, mạch điện hay dao động điều hòa bỗng trở nên nhẹ nhàng và gần gũi hơn bao giờ hết.',
    'Có những lúc cả lớp còn nhiều thiếu sót, áp lực thi cử hay những lần lỡ làm cô phiền lòng. Thay vì trách mắng nặng nề, cô luôn chọn cách ngồi lại lắng nghe, hỏi han từng bạn đang gặp khó khăn gì và kiên nhẫn dẫn dắt để cả tập thể cùng tiến bộ mỗi ngày.',
    'Cảm ơn cô vì những giờ Vật Lý giảng say sưa không biết mệt, vì từng lời nhắc nhở chân thành trong các tiết sinh hoạt lớp, và vì niềm tin dịu dàng cô luôn dành cho mỗi học sinh.',
    'Mai này dù mỗi đứa bước tiếp trên những ngả đường riêng, ký ức về một năm được làm học trò dưới sự dìu dắt của cô Huyền vẫn mãi là mảnh ghép ấm áp nhất tuổi học trò.',
    'Nhân ngày Nhà giáo Việt Nam 20/11, chúng em kính chúc cô luôn thật nhiều sức khỏe, đôi mắt mãi ánh lên niềm vui và trái tim luôn bình an bên những thế hệ học trò thân thương.',
  ],
  letterSignature: 'Mãi yêu và biết ơn cô,\nTập thể lớp 12C3',

  journey: [
    {
      id: 'j-1',
      chapter: 'Chương 01',
      period: 'Ngày đầu nhận lớp',
      title: 'Buổi gặp gỡ đầu tiên cùng Cô Huyền — khởi đầu một năm học đáng nhớ',
      description:
        'Ngày đầu nhận lớp, sự nhẹ nhàng và cách trò chuyện gần gũi của cô đã nhanh chóng gắn kết cả tập thể thành một gia đình.',
      gratitudeNote: 'Cảm ơn cô vì sự ấm áp ngay từ buổi gặp mặt đầu tiên.',
      image: '/src/assets/images/hero_classroom_sunlight_1794662289206.jpg',
    },
    {
      id: 'j-2',
      chapter: 'Chương 02',
      period: 'Những tiết Vật Lý',
      title: 'Biến những bài học tưởng chừng khô khan thành giờ khám phá thú vị',
      description:
        'Từ từng công thức đến các hiện tượng đời thực, cô luôn kiên nhẫn giải thích cặn kẽ để cả lớp hiểu sâu và không còn ngại môn Lý.',
      gratitudeNote: 'Cảm ơn cô vì những bài giảng tâm huyết và dễ hiểu.',
      image: '/src/assets/images/memory_class_yard_1794662291903.jpg',
    },
    {
      id: 'j-3',
      chapter: 'Chương 03',
      period: 'Những giờ sinh hoạt',
      title: 'Lắng nghe, sẻ chia và nâng đỡ tinh thần cho từng học trò',
      description:
        'Mỗi khi lớp gặp áp lực học tập hay chuyện buồn vui tuổi học trò, cô luôn là người đầu tiên đứng ra động viên và gỡ rối.',
      gratitudeNote: 'Cảm ơn cô vì đã luôn bao dung và tin tưởng chúng em.',
      image: '/src/assets/images/homeroom_teacher_portrait_1794662289452.jpg',
    },
    {
      id: 'j-4',
      chapter: 'Chương 04',
      period: '20/11 · Hôm nay & Mãi mãi',
      title: 'Mùa tri ân trưởng thành',
      description:
        'Chặng đường cuối cấp đang đến gần, nhưng tất cả ký ức cùng cô sẽ mãi là đoạn phim đẹp nhất mà cả lớp nâng niu giữ lại.',
      gratitudeNote: 'Cảm ơn cô — vì tất cả những điều lớn lao được gói trong sự dịu dàng thầm lặng.',
      image: '/src/assets/images/memory_chalkboard_farewell_1794662291819.jpg',
    },
  ] as JourneyMilestone[],

  specialAlbum: [
    {
      id: 'hr-1',
      title: 'Cô bên khung cửa nắng chiều',
      caption: 'Nụ cười quen thuộc mà mỗi sáng đến lớp tụi em chỉ cần nhìn thấy là thấy an tâm.',
      dateLabel: 'Kỷ yếu Cô & Lớp',
      category: 'Cùng thầy cô',
      image: '/src/assets/images/homeroom_teacher_portrait_1794662289452.jpg',
      aspect: 'portrait',
    },
    {
      id: 'hr-2',
      title: 'Bục giảng và đóa hoa tri ân',
      caption: 'Nơi cô đã đứng suốt hàng trăm giờ học để truyền lửa tri thức và yêu thương.',
      dateLabel: 'Sáng 20/11',
      category: 'Cùng thầy cô',
      image: '/src/assets/images/memory_chalkboard_farewell_1794662291819.jpg',
      aspect: 'landscape',
    },
    {
      id: 'hr-3',
      title: 'Khoảng sân phượng vĩ năm nào',
      caption: 'Chuyến chụp ảnh tập thể đầu tiên có cô đứng giữa vòng tay 42 học trò.',
      dateLabel: 'Mùa hè năm lớp 11',
      category: 'Hoạt động',
      image: '/src/assets/images/memory_class_yard_1794662291903.jpg',
      aspect: 'landscape',
    },
    {
      id: 'hr-4',
      title: 'Phòng học 12C3 lúc tan trường',
      caption: 'Sau mỗi buổi chiều nắng tắt, vẫn còn bóng cô ngồi kiểm tra lại sổ đầu bài trước khi ra về.',
      dateLabel: 'Góc lớp quen thuộc',
      category: 'Lớp học',
      image: '/src/assets/images/hero_classroom_sunlight_1794662289206.jpg',
      aspect: 'landscape',
    },
  ] as MemoryPhoto[],

  closingDedication:
    '“Sau này dù có đi qua bao nhiêu giảng đường rộng lớn, chúng em vẫn biết rằng chẳng nơi đâu có một người chủ nhiệm thương mình như người nhà giống cô.”',
};

export const VIDEO_SECTION_DATA = {
  // [THAY THẾ TẠI ĐÂY] Đặt file MP4 vào /public/assets/videos/class-memories.mp4 và đổi videoUrl nếu cần
  title: 'Thước phim ký ức 12C3',
  subtitle: 'Những lát cắt thanh xuân được ghi lại qua từng mùa khai giảng, hội trại và giờ ra chơi.',
  videoUrl: '/assets/videos/class-memories.mp4',
  posterImage: '/src/assets/images/memory_class_yard_1794662291903.jpg',
  durationLabel: '03:45 · Phim ngắn tập thể',
  placeholderNote:
    'Chưa có tệp video MP4 tại đường dẫn /assets/videos/class-memories.mp4. Khi chép video của lớp vào thư mục public/assets/videos/, trình phát sẽ tự động phát thước phim này theo yêu cầu của bạn.',
};

export const FINALE_DATA = {
  eyebrow: 'Lời kết cho một mùa tri ân',
  headline: 'Cảm ơn Thầy Cô đã làm rực rỡ những năm tháng tuổi trẻ của chúng em',
  collectiveMessage:
    'Thời gian có thể làm phai mờ những dòng phấn trắng trên bảng xanh, nhưng tình cảm chân thành và những bài học làm người từ thầy cô sẽ ở lại mãi trong tim tập thể lớp 12C3.',
  featuredImage: '/src/assets/images/memory_chalkboard_farewell_1794662291819.jpg',
  closingCalligraphy: 'Kính chúc Thầy Cô một ngày 20/11 thật bình an và hạnh phúc.',
};

export const INITIAL_SEED_WISHES: SeedWish[] = [
  {
    id: 'seed-1',
    author: 'Minh Anh · Lớp trưởng 12C3',
    message:
      'Kính chúc quý thầy cô luôn dồi dào sức khỏe, giữ mãi ngọn lửa nhiệt huyết trên bục giảng và mãi là điểm tựa dịu dàng trong ký ức tuổi học trò của chúng em.',
    created_at: '2026-11-12T08:30:00.000Z',
  },
  {
    id: 'seed-2',
    author: 'Hoàng Nam · Tổ 2',
    message:
      'Cảm ơn cô Huyền chủ nhiệm đã luôn kiên nhẫn lắng nghe, giảng dạy môn Vật Lý thật dễ hiểu và bao dung cho những lần tụi em bồng bột. Ngày 20/11 thật nhiều niềm vui gửi đến cô ạ!',
    created_at: '2026-11-12T14:15:00.000Z',
  },
  {
    id: 'seed-3',
    author: 'Ẩn danh',
    message:
      'Dù sau này có đi qua bao nhiêu mùa phượng nữa, em vẫn không bao giờ quên những tiết học đầy ắp tiếng cười ở phòng học tầng hai và lời động viên của thầy cô trước kỳ thi.',
    created_at: '2026-11-13T09:40:00.000Z',
  },
  {
    id: 'seed-4',
    author: 'Thảo Vy · Tổ 4',
    message:
      'Chúc thầy Thoại, cô Thảo, cô Quyên, thầy Hải, thầy Linh, thầy Thủy, cô Bông, thầy Thanh và cô Huyền một mùa Hiến chương 20/11 thật ấm áp, bình an và nhiều sức khỏe!',
    created_at: '2026-11-13T16:20:00.000Z',
  },
];
