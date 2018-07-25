// no party preference not counted
// write ins not counted
// working families party votes go to candidate main party
// democratic-farmer-labor -> democrat
// only rep, dem, lib, green
const voteData = {
  114: [
    { state: "Alabama", district: 1, votes: [{ rep: 208083 }] },
    { state: "Alabama", district: 2, votes: [{ rep: 134886, dem: 112089 }] },
    { state: "Alabama", district: 3, votes: [{ rep: 192164, dem: 94549 }] },
    { state: "Alabama", district: 4, votes: [{ rep: 235925 }] },
    { state: "Alabama", district: 5, votes: [{ rep: 205647, dem: 102234 }] },
    { state: "Alabama", district: 6, votes: [{ rep: 245313, dem: 83709 }] },
    { state: "Alabama", district: 7, votes: [{ dem: 229330 }] },
    {
      state: "Alaska",
      district: 1,
      votes: [{ rep: 155088, dem: 111019, lib: 31770 }]
    },
    {
      state: "Arizona",
      district: 1,
      votes: [{ rep: 121745, dem: 142219, grn: 16746 }]
    },
    {
      state: "Arizona",
      district: 2,
      votes: [{ rep: 179806, dem: 135873 }]
    },
    {
      state: "Arizona",
      district: 3,
      votes: [{ rep: 1303 + 332, dem: 148973 + 283 }]
    },
    {
      state: "Arizona",
      district: 4,
      votes: [{ rep: 203487, dem: 81296 }]
    },
    {
      state: "Arizona",
      district: 5,
      votes: [{ rep: 205184, dem: 114940 }]
    },
    {
      state: "Arizona",
      district: 6,
      votes: [{ rep: 201578, dem: 122866 }]
    },
    {
      state: "Arizona",
      district: 7,
      votes: [{ rep: 39286, dem: 119465, grn: 60 }]
    },
    {
      state: "Arizona",
      district: 8,
      votes: [{ rep: 204942 + 75, grn: 93954 }]
    },
    {
      state: "Arizona",
      district: 9,
      votes: [{ rep: 108350, dem: 169055, grn: 56 }]
    },
    { state: "Arkansas", district: 1, votes: [{ rep: 183866, lib: 57181 }] },
    {
      state: "Arkansas",
      district: 2,
      votes: [{ rep: 176472, lib: 14342, dem: 111347 }]
    },
    { state: "Arkansas", district: 3, votes: [{ rep: 217192, lib: 63715 }] },
    { state: "Arkansas", district: 4, votes: [{ rep: 182885, lib: 61274 }] },
    { state: "California", district: 1, votes: [{ rep: 185448, dem: 128588 }] },
    { state: "California", district: 2, votes: [{ rep: 76572, dem: 254194 }] },
    { state: "California", district: 3, votes: [{ rep: 104453, dem: 152513 }] },
    { state: "California", district: 4, votes: [{ rep: 220133, dem: 130845 }] },
    { state: "California", district: 5, votes: [{ rep: 67565, dem: 224526 }] },
    { state: "California", district: 6, votes: [{ rep: 57848, dem: 177565 }] },
    { state: "California", district: 7, votes: [{ rep: 145168, dem: 152133 }] },
    { state: "California", district: 8, votes: [{ rep: 136972, dem: 83035 }] },
    { state: "California", district: 9, votes: [{ rep: 98992, dem: 133163 }] },
    {
      state: "California",
      district: 10,
      votes: [{ rep: 124671, dem: 116470 }]
    },
    { state: "California", district: 11, votes: [{ rep: 83341, dem: 214868 }] },
    { state: "California", district: 12, votes: [{ dem: 274035 }] },
    { state: "California", district: 13, votes: [{ rep: 29754, dem: 293117 }] },
    { state: "California", district: 14, votes: [{ rep: 54817, dem: 231630 }] },
    { state: "California", district: 15, votes: [{ rep: 70619, dem: 198578 }] },
    { state: "California", district: 16, votes: [{ rep: 70483, dem: 97473 }] },
    { state: "California", district: 17, votes: [{ dem: 142268 + 90924 }] },
    { state: "California", district: 18, votes: [{ rep: 93470, dem: 230460 }] },
    { state: "California", district: 19, votes: [{ rep: 64061, dem: 181802 }] },
    { state: "California", district: 20, votes: [{ rep: 74811, dem: 180980 }] },
    { state: "California", district: 21, votes: [{ rep: 75126, dem: 57282 }] },
    { state: "California", district: 22, votes: [{ rep: 158755, dem: 76211 }] },
    { state: "California", district: 23, votes: [{ rep: 167116, dem: 74468 }] },
    {
      state: "California",
      district: 24,
      votes: [{ rep: 144780, dem: 166034 }]
    },
    {
      state: "California",
      district: 25,
      votes: [{ rep: 138755, dem: 122406 }]
    },
    {
      state: "California",
      district: 26,
      votes: [{ rep: 111059, dem: 169248 }]
    },
    { state: "California", district: 27, votes: [{ rep: 81655, dem: 168977 }] },
    { state: "California", district: 28, votes: [{ rep: 59526, dem: 210883 }] },
    { state: "California", district: 29, votes: [{ dem: 128407 + 43417 }] },
    { state: "California", district: 30, votes: [{ rep: 77325, dem: 205279 }] },
    { state: "California", district: 31, votes: [{ rep: 94866, dem: 121070 }] },
    { state: "California", district: 32, votes: [{ dem: 114926 + 71720 }] },
    {
      state: "California",
      district: 33,
      votes: [{ rep: 110822, dem: 219397 }]
    },
    { state: "California", district: 34, votes: [{ dem: 122842 + 36314 }] },
    { state: "California", district: 35, votes: [{ rep: 47309, dem: 124044 }] },
    { state: "California", district: 36, votes: [{ rep: 88269, dem: 144348 }] },
    { state: "California", district: 37, votes: [{ dem: 192490 + 44782 }] },
    { state: "California", district: 38, votes: [{ rep: 68524, dem: 163590 }] },
    {
      state: "California",
      district: 39,
      votes: [{ rep: 150777, dem: 112679 }]
    },
    { state: "California", district: 40, votes: [{ dem: 106554 }] },
    { state: "California", district: 41, votes: [{ rep: 69159, dem: 128164 }] },
    {
      state: "California",
      district: 42,
      votes: [{ rep: 149547, dem: 104689 }]
    },
    { state: "California", district: 43, votes: [{ rep: 52499, dem: 167017 }] },
    { state: "California", district: 44, votes: [{ dem: 93124 + 85289 }] },
    {
      state: "California",
      district: 45,
      votes: [{ rep: 182618, dem: 129231 }]
    },
    { state: "California", district: 46, votes: [{ dem: 115248 + 49345 }] },
    { state: "California", district: 47, votes: [{ rep: 88109, dem: 154759 }] },
    {
      state: "California",
      district: 48,
      votes: [{ rep: 178701, dem: 127715 }]
    },
    {
      state: "California",
      district: 49,
      votes: [{ rep: 155888, dem: 154267 }]
    },
    {
      state: "California",
      district: 50,
      votes: [{ rep: 179937, dem: 103646 }]
    },
    { state: "California", district: 51, votes: [{ rep: 54362, dem: 145162 }] },
    {
      state: "California",
      district: 52,
      votes: [{ rep: 139403, dem: 181253 }]
    },
    { state: "California", district: 53, votes: [{ rep: 97968, dem: 198988 }] },
    {
      state: "Colorado",
      district: 1,
      votes: [{ rep: 105030, dem: 257254, lib: 16752 }]
    },
    {
      state: "Colorado",
      district: 2,
      votes: [{ rep: 170001, dem: 260175, lib: 27136 }]
    },
    {
      state: "Colorado",
      district: 3,
      votes: [{ rep: 204220, dem: 150914, lib: 18903 }]
    },
    {
      state: "Colorado",
      district: 4,
      votes: [{ rep: 248230, dem: 123642, lib: 18761 }]
    },
    {
      state: "Colorado",
      district: 5,
      votes: [{ rep: 225445, dem: 111676, lib: 24872 }]
    },
    {
      state: "Colorado",
      district: 6,
      votes: [{ rep: 191626, dem: 160372, lib: 18778, grn: 5641 }]
    },
    {
      state: "Colorado",
      district: 7,
      votes: [{ rep: 144066, dem: 199758, lib: 18186, grn: 5641 }]
    },
    {
      state: "Connecticut",
      district: 1,
      votes: [{ rep: 105674, dem: 187021 + 13665, grn: 6563 }]
    },
    {
      state: "Connecticut",
      district: 2,
      votes: [{ rep: 111149, dem: 186210 + 22608, grn: 5332, lib: 4949 }]
    },
    {
      state: "Connecticut",
      district: 3,
      votes: [{ rep: 95786, dem: 192274 + 21298 }]
    },
    {
      state: "Connecticut",
      district: 4,
      votes: [{ rep: 120653 + 5071, dem: 187811 }]
    },
    {
      state: "Connecticut",
      district: 5,
      votes: [{ rep: 124900 + 4901, dem: 163499 + 15753 }]
    },
    {
      state: "Delaware",
      district: 1,
      votes: [{ rep: 172301, dem: 233554, grn: 8326, lib: 6436 }]
    },
    { state: "Florida", district: 1, votes: [{ rep: 255107, dem: 114079 }] },
    {
      state: "Florida",
      district: 2,
      votes: [{ rep: 231163, dem: 102801, lib: 9395 }]
    },
    {
      state: "Florida",
      district: 3,
      votes: [{ rep: 193843, dem: 136338 }]
    },
    {
      state: "Florida",
      district: 4,
      votes: [{ rep: 287509, dem: 113088 }]
    },
    { state: "Florida", district: 5, votes: [{ rep: 108325, dem: 194549 }] },
    { state: "Florida", district: 6, votes: [{ rep: 213519, dem: 151051 }] },
    { state: "Florida", district: 7, votes: [{ rep: 171583, dem: 182039 }] },
    {
      state: "Florida",
      district: 8,
      votes: [{ rep: 246483, dem: 127127 }]
    },
    { state: "Florida", district: 9, votes: [{ rep: 144450, dem: 195311 }] },
    { state: "Florida", district: 10, votes: [{ rep: 107498, dem: 198491 }] },
    {
      state: "Florida",
      district: 11,
      votes: [{ rep: 258016, dem: 124713 }]
    },
    { state: "Florida", district: 12, votes: [{ rep: 253559, dem: 116110 }] },
    { state: "Florida", district: 13, votes: [{ rep: 171149, dem: 184693 }] },
    { state: "Florida", district: 14, votes: [{ rep: 121088, dem: 195789 }] },
    { state: "Florida", district: 15, votes: [{ rep: 182999, dem: 135475 }] },
    { state: "Florida", district: 16, votes: [{ rep: 230654, dem: 155262 }] },
    {
      state: "Florida",
      district: 17,
      votes: [{ rep: 209348, dem: 115974 }]
    },
    {
      state: "Florida",
      district: 18,
      votes: [{ rep: 201488, dem: 161918 }]
    },
    { state: "Florida", district: 19, votes: [{ rep: 239225, dem: 123812 }] },
    { state: "Florida", district: 20, votes: [{ rep: 54646, dem: 222914 }] },
    {
      state: "Florida",
      district: 21,
      votes: [{ rep: 118038, dem: 210606 }]
    },
    { state: "Florida", district: 22, votes: [{ rep: 138737, dem: 199113 }] },
    {
      state: "Florida",
      district: 23,
      votes: [{ rep: 130818, dem: 183225 }]
    },
    { state: "Florida", district: 24, votes: [], winner: "dem" },
    { state: "Florida", district: 25, votes: [{ rep: 157921, dem: 95319 }] },
    {
      state: "Florida",
      district: 26,
      votes: [{ rep: 148547, dem: 115493 }]
    },
    { state: "Florida", district: 27, votes: [{ rep: 157917, dem: 129760 }] },
    { state: "Georgia", district: 1, votes: [{ rep: 210243 }] },
    { state: "Georgia", district: 2, votes: [{ rep: 94056, dem: 148543 }] },
    { state: "Georgia", district: 3, votes: [{ rep: 207218, dem: 95969 }] },
    { state: "Georgia", district: 4, votes: [{ rep: 70593, dem: 220146 }] },
    { state: "Georgia", district: 5, votes: [{ rep: 46768, dem: 253781 }] },
    { state: "Georgia", district: 6, votes: [{ rep: 201088, dem: 124917 }] },
    { state: "Georgia", district: 7, votes: [{ rep: 174081, dem: 114220 }] },
    { state: "Georgia", district: 8, votes: [{ rep: 173983, dem: 83225 }] },
    { state: "Georgia", district: 9, votes: [{ rep: 256535 }] },
    { state: "Georgia", district: 10, votes: [{ rep: 243725 }] },
    { state: "Georgia", district: 11, votes: [{ rep: 217935, dem: 105383 }] },
    { state: "Georgia", district: 12, votes: [{ rep: 159492, dem: 99420 }] },
    { state: "Georgia", district: 13, votes: [{ dem: 252833 }] },
    { state: "Georgia", district: 14, votes: [{ rep: 216743 }] },
    {
      state: "Hawaii",
      district: 1,
      votes: [{ rep: 45958, dem: 145417, lib: 6601 }]
    },
    { state: "Hawaii", district: 2, votes: [{ rep: 39668, dem: 170848 }] },
    { state: "Idaho", district: 1, votes: [{ rep: 242252, dem: 113052 }] },
    {
      state: "Idaho",
      district: 2,
      votes: [{ rep: 205292, dem: 95940 }]
    },
    { state: "Illinois", district: 1, votes: [{ rep: 81817, dem: 234037 }] },
    { state: "Illinois", district: 2, votes: [{ rep: 59471, dem: 235051 }] },
    { state: "Illinois", district: 3, votes: [{ dem: 225320 }] },
    { state: "Illinois", district: 4, votes: [{ dem: 171297 }] },
    {
      state: "Illinois",
      district: 5,
      votes: [{ rep: 86222, dem: 212842, grn: 14657 }]
    },
    { state: "Illinois", district: 6, votes: [{ rep: 208555, dem: 143591 }] },
    { state: "Illinois", district: 7, votes: [{ rep: 46882, dem: 250584 }] },
    { state: "Illinois", district: 8, votes: [{ rep: 103617, dem: 144954 }] },
    { state: "Illinois", district: 9, votes: [{ rep: 109550, dem: 217306 }] },
    { state: "Illinois", district: 10, votes: [{ rep: 135535, dem: 150435 }] },
    { state: "Illinois", district: 11, votes: [{ rep: 108995, dem: 166578 }] },
    {
      state: "Illinois",
      district: 12,
      votes: [{ rep: 169976, dem: 124246, grn: 18780 }]
    },
    { state: "Illinois", district: 13, votes: [{ rep: 187583, dem: 126811 }] },
    { state: "Illinois", district: 14, votes: [{ rep: 200508, dem: 137589 }] },
    { state: "Illinois", district: 15, votes: [{ rep: 274554 }] },
    { state: "Illinois", district: 16, votes: [{ rep: 259722 }] },
    { state: "Illinois", district: 17, votes: [{ rep: 113943, dem: 173125 }] },
    { state: "Illinois", district: 18, votes: [{ rep: 250506, dem: 96770 }] },
    { state: "Indiana", district: 1, votes: [{ dem: 207515, lib: 47051 }] },
    {
      state: "Indiana",
      district: 2,
      votes: [{ rep: 164355, dem: 102401, lib: 10601 }]
    },
    {
      state: "Indiana",
      district: 3,
      votes: [{ rep: 201396, dem: 66023, lib: 19828 }]
    },
    {
      state: "Indiana",
      district: 4,
      votes: [{ rep: 193412, dem: 91256, lib: 14766 }]
    },
    {
      state: "Indiana",
      district: 5,
      votes: [{ rep: 221957, dem: 123849, lib: 15329 }]
    },
    {
      state: "Indiana",
      district: 6,
      votes: [{ rep: 204920, dem: 79135, lib: 12330 }]
    },
    {
      state: "Indiana",
      district: 7,
      votes: [{ rep: 94456, dem: 158739, lib: 11475 }]
    },
    {
      state: "Indiana",
      district: 8,
      votes: [{ rep: 187702, dem: 93356, lib: 13655 }]
    },
    {
      state: "Indiana",
      district: 9,
      votes: [{ rep: 174791, dem: 130627, lib: 17425 }]
    },
    { state: "Iowa", district: 1, votes: [{ rep: 206903, dem: 177403 }] },
    { state: "Iowa", district: 2, votes: [{ rep: 170933, dem: 198571 }] },
    {
      state: "Iowa",
      district: 3,
      votes: [{ rep: 208598, dem: 155002, lib: 15372 }]
    },
    {
      state: "Iowa",
      district: 4,
      votes: [{ rep: 226719, dem: 142993, lib: 15372 }]
    },
    {
      state: "Kansas",
      district: 1,
      votes: [{ rep: 169992, lib: 19366 }]
    },
    {
      state: "Kansas",
      district: 2,
      votes: [{ rep: 181228, dem: 96840, lib: 19333 }]
    },
    {
      state: "Kansas",
      district: 3,
      votes: [{ rep: 176022, dem: 139300, lib: 27791 }]
    },
    {
      state: "Kansas",
      district: 4,
      votes: [{ rep: 166998, dem: 81495, lib: 7737 }]
    },
    { state: "Kentucky", district: 1, votes: [{ rep: 216959, dem: 81710 }] },
    { state: "Kentucky", district: 2, votes: [{ rep: 251825 }] },
    { state: "Kentucky", district: 3, votes: [{ rep: 122093, dem: 212401 }] },
    { state: "Kentucky", district: 4, votes: [{ rep: 233922, dem: 94065 }] },
    { state: "Kentucky", district: 5, votes: [{ rep: 221242 }] },
    { state: "Kentucky", district: 6, votes: [{ rep: 202099, dem: 128728 }] },
    {
      state: "Louisiana",
      district: 1,
      votes: [{ rep: 243645, dem: 41840 + 12708 + 9237, lib: 9405, grn: 6717 }]
    },
    {
      state: "Louisiana",
      district: 2,
      votes: [{ dem: 198289 + 57125 + 28855 }]
    },
    { state: "Louisiana", district: 3, votes: [{ rep: 77671 + 60762 }] },
    { state: "Louisiana", district: 4, votes: [{ rep: 87370, dem: 46579 }] },
    { state: "Louisiana", district: 5, votes: [{ rep: 208545 + 47117 }] },
    {
      state: "Louisiana",
      district: 6,
      votes: [{ rep: 207483 + 33592, dem: 49380 + 29822, lib: 7603 }]
    },
    { state: "Maine", district: 1, votes: [{ rep: 164569, dem: 227546 }] },
    { state: "Maine", district: 2, votes: [{ rep: 192878, dem: 159081 }] },
    {
      state: "Maryland",
      district: 1,
      votes: [{ rep: 242574, dem: 103622, lib: 15370 }]
    },
    {
      state: "Maryland",
      district: 2,
      votes: [{ rep: 102577, dem: 192183, lib: 14128 }]
    },
    {
      state: "Maryland",
      district: 3,
      votes: [{ rep: 115048, dem: 214640, grn: 9461 }]
    },
    {
      state: "Maryland",
      district: 4,
      votes: [{ rep: 68670, dem: 237501, grn: 8204, lib: 5744 }]
    },
    {
      state: "Maryland",
      district: 5,
      votes: [{ rep: 105931, dem: 242989, lib: 11078 }]
    },
    {
      state: "Maryland",
      district: 6,
      votes: [{ rep: 133081, dem: 185770, lib: 6889, grn: 5824 }]
    },
    {
      state: "Maryland",
      district: 7,
      votes: [{ rep: 69556, dem: 238838, grn: 9715 }]
    },
    {
      state: "Maryland",
      district: 8,
      votes: [{ rep: 124651, dem: 220657, grn: 11201, lib: 7283 }]
    },
    {
      state: "Massachusetts",
      district: 1,
      votes: [{ dem: 235803, lib: 27511 }]
    },
    { state: "Massachusetts", district: 2, votes: [{ dem: 275487 }] },
    {
      state: "Massachusetts",
      district: 3,
      votes: [{ rep: 107519, dem: 236713 }]
    },
    {
      state: "Massachusetts",
      district: 4,
      votes: [{ rep: 113055, dem: 265823 }]
    },
    { state: "Massachusetts", district: 5, votes: [{ dem: 285606 }] },
    { state: "Massachusetts", district: 6, votes: [{ dem: 308923 }] },
    { state: "Massachusetts", district: 7, votes: [{ dem: 253354 }] },
    {
      state: "Massachusetts",
      district: 8,
      votes: [{ rep: 102744, dem: 271019 }]
    },
    {
      state: "Massachusetts",
      district: 9,
      votes: [{ rep: 127803, dem: 211790 }]
    },
    {
      state: "Michigan",
      district: 1,
      votes: [{ rep: 197777, dem: 144334, lib: 13386, grn: 4774 }]
    },
    {
      state: "Michigan",
      district: 2,
      votes: [{ rep: 212508, dem: 110391, lib: 8154, grn: 5353 }]
    },
    {
      state: "Michigan",
      district: 3,
      votes: [{ rep: 203545, dem: 128400 }]
    },
    {
      state: "Michigan",
      district: 4,
      votes: [{ rep: 194572, dem: 101277, lib: 8516, grn: 3953 }]
    },
    {
      state: "Michigan",
      district: 5,
      votes: [{ rep: 112102, dem: 195279, lib: 7006, grn: 4904 }]
    },
    {
      state: "Michigan",
      district: 6,
      votes: [{ rep: 193259, dem: 119980, lib: 16248 }]
    },
    {
      state: "Michigan",
      district: 7,
      votes: [{ rep: 184321, dem: 134010, lib: 16476 }]
    },
    {
      state: "Michigan",
      district: 8,
      votes: [{ rep: 205629, dem: 143791, lib: 9619, grn: 5679 }]
    },
    {
      state: "Michigan",
      district: 9,
      votes: [{ rep: 128937, dem: 199661, lib: 9563, grn: 6614 }]
    },
    {
      state: "Michigan",
      district: 10,
      votes: [{ rep: 215132, dem: 110112, lib: 10612, grn: 5127 }]
    },
    {
      state: "Michigan",
      district: 11,
      votes: [{ rep: 200872, dem: 152461, lib: 9545 }]
    },
    {
      state: "Michigan",
      district: 12,
      votes: [{ rep: 96104, dem: 211378, lib: 7489, grn: 4377 }]
    },
    {
      state: "Michigan",
      district: 13,
      votes: [{ rep: 40541, dem: 198771, lib: 9648 }]
    },
    {
      state: "Michigan",
      district: 14,
      votes: [{ rep: 58103, dem: 244135, lib: 4893, grn: 3843 }]
    },
    {
      state: "Minnesota",
      district: 1,
      votes: [{ rep: 166524, dem: 169071 }]
    },
    {
      state: "Minnesota",
      district: 2,
      votes: [{ rep: 173970, dem: 167315 }]
    },
    {
      state: "Minnesota",
      district: 2,
      votes: [{ rep: 173970, dem: 167315 }]
    },
    { state: "Minnesota", district: 3, votes: [{ rep: 223075, dem: 169238 }] },
    {
      state: "Minnesota",
      district: 4,
      votes: [{ rep: 121033, dem: 203299, mar: 27152 }]
    },
    {
      state: "Minnesota",
      district: 5,
      votes: [{ rep: 80660, dem: 249957, mar: 30759 }]
    },
    { state: "Minnesota", district: 6, votes: [{ rep: 235385, dem: 123010 }] },
    { state: "Minnesota", district: 7, votes: [{ rep: 156944, dem: 173572 }] },
    { state: "Minnesota", district: 8, votes: [{ rep: 177088, dem: 179097 }] },
    {
      state: "Mississippi",
      district: 1,
      votes: [{ rep: 206455, dem: 83947, lib: 6181 }]
    },
    {
      state: "Mississippi",
      district: 2,
      votes: [{ rep: 83542, dem: 192343 }]
    },
    {
      state: "Mississippi",
      district: 3,
      votes: [{ rep: 209490, dem: 96101, vet: 8696 }]
    },
    {
      state: "Mississippi",
      district: 4,
      votes: [{ rep: 181323, dem: 77505, lib: 14687 }]
    },
    {
      state: "Missouri",
      district: 1,
      votes: [{ rep: 62714, dem: 236993, lib: 14317 }]
    },
    {
      state: "Missouri",
      district: 2,
      votes: [{ rep: 241954, dem: 155689, lib: 11758, grn: 3895 }]
    },
    {
      state: "Missouri",
      district: 3,
      votes: [{ rep: 249865, dem: 102891, lib: 11962 }]
    },
    {
      state: "Missouri",
      district: 4,
      votes: [{ rep: 225348, dem: 92510, lib: 14376 }]
    },
    {
      state: "Missouri",
      district: 5,
      votes: [{ rep: 123771, dem: 190766, lib: 9733 }]
    },
    {
      state: "Missouri",
      district: 6,
      votes: [{ rep: 238388, dem: 99692, lib: 8123, grn: 4241 }]
    },
    {
      state: "Missouri",
      district: 7,
      votes: [{ rep: 228692, dem: 92756, lib: 17153 }]
    },
    {
      state: "Missouri",
      district: 8,
      votes: [{ rep: 229792, dem: 70009, lib: 9070 }]
    },
    {
      state: "Montana",
      district: 1,
      votes: [{ rep: 285358, dem: 205919, lib: 16554 }]
    },
    { state: "Nebraska", district: 1, votes: [{ rep: 189771, dem: 83467 }] },
    {
      state: "Nebraska",
      district: 2,
      votes: [{ rep: 141066, dem: 137602, lib: 9640 }]
    },
    { state: "Nebraska", district: 3, votes: [{ rep: 226720 }] },
    { state: "Nevada", district: 1, votes: [{ rep: 54174, dem: 116537 }] },
    { state: "Nevada", district: 2, votes: [{ rep: 182676, dem: 115722 }] },
    { state: "Nevada", district: 3, votes: [{ rep: 142926, dem: 146869 }] },
    {
      state: "Nevada",
      district: 4,
      votes: [{ rep: 118328, dem: 128985, lib: 10206 }]
    },
    {
      state: "New Hampshire",
      district: 1,
      votes: [{ rep: 157176, dem: 162080, lib: 5507 }]
    },
    {
      state: "New Hampshire",
      district: 2,
      votes: [{ rep: 158825, dem: 174371 }]
    },
    {
      state: "New Jersey",
      district: 1,
      votes: [{ rep: 112388, dem: 183231, lib: 2410 }]
    },
    {
      state: "New Jersey",
      district: 2,
      votes: [{ rep: 176338, dem: 110838, lib: 3773 }]
    },
    { state: "New Jersey", district: 3, votes: [{ rep: 194596, dem: 127526 }] },
    {
      state: "New Jersey",
      district: 4,
      votes: [{ rep: 211992, dem: 111532, lib: 3320 }]
    },
    {
      state: "New Jersey",
      district: 5,
      votes: [{ rep: 157690, dem: 172587, lib: 7424 }]
    },
    {
      state: "New Jersey",
      district: 6,
      votes: [{ rep: 91908, dem: 167895, grn: 1912, lib: 1720 }]
    },
    {
      state: "New Jersey",
      district: 7,
      votes: [{ rep: 185850, dem: 148188, lib: 5343 }]
    },
    {
      state: "New Jersey",
      district: 8,
      votes: [{ rep: 32337, dem: 134733, lib: 3438 }]
    },
    {
      state: "New Jersey",
      district: 9,
      votes: [{ rep: 65376, dem: 162642, lib: 3327 }]
    },
    { state: "New Jersey", district: 10, votes: [{ rep: 26450, dem: 190856 }] },
    {
      state: "New Jersey",
      district: 11,
      votes: [{ rep: 194299, dem: 130162, lib: 3475 }]
    },
    {
      state: "New Jersey",
      district: 12,
      votes: [{ rep: 92407, dem: 181430, lib: 2482, grn: 2135 }]
    },
    { state: "New Mexico", district: 1, votes: [{ rep: 96879, dem: 181088 }] },
    { state: "New Mexico", district: 2, votes: [{ rep: 143515, dem: 85232 }] },
    { state: "New Mexico", district: 3, votes: [{ rep: 102730, dem: 170612 }] },
    { state: "New York", district: 1, votes: [{ rep: 158409, dem: 126635 }] },
    { state: "New York", district: 2, votes: [{ rep: 157571, dem: 102270 }] },
    { state: "New York", district: 3, votes: [{ rep: 133954, dem: 171775 }] },
    { state: "New York", district: 4, votes: [{ rep: 111246, dem: 181861 }] },
    {
      state: "New York",
      district: 5,
      votes: [{ rep: 26791, dem: 197852, grn: 3587 }]
    },
    { state: "New York", district: 6, votes: [{ rep: 43770, dem: 131463 }] },
    { state: "New York", district: 7, votes: [{ rep: 14941, dem: 165819 }] },
    { state: "New York", district: 8, votes: [{ dem: 203235 }] },
    { state: "New York", district: 9, votes: [{ dem: 198886 }] },
    { state: "New York", district: 10, votes: [{ rep: 46275, dem: 180117 }] },
    {
      state: "New York",
      district: 11,
      votes: [{ rep: 122606, dem: 85257, grn: 3906 }]
    },
    { state: "New York", district: 12, votes: [{ rep: 49398, dem: 230153 }] },
    {
      state: "New York",
      district: 13,
      votes: [{ rep: 13129, dem: 207194, grn: 8248 }]
    },
    { state: "New York", district: 14, votes: [{ rep: 26891, dem: 138367 }] },
    { state: "New York", district: 15, votes: [{ rep: 6129, dem: 165688 }] },
    { state: "New York", district: 16, votes: [{ dem: 198811 }] },
    { state: "New York", district: 17, votes: [{ dem: 193819 }] },
    { state: "New York", district: 18, votes: [{ rep: 111117, dem: 140951 }] },
    { state: "New York", district: 19, votes: [{ rep: 135905, dem: 125956 }] },
    { state: "New York", district: 20, votes: [{ rep: 83328, dem: 188428 }] },
    { state: "New York", district: 21, votes: [{ rep: 152597, dem: 75965 }] },
    { state: "New York", district: 22, votes: [{ rep: 113287, dem: 102734 }] },
    { state: "New York", district: 23, votes: [{ rep: 136964, dem: 106600 }] },
    { state: "New York", district: 24, votes: [{ rep: 150330, dem: 110550 }] },
    { state: "New York", district: 25, votes: [{ rep: 113840, dem: 168660 }] },
    { state: "New York", district: 26, votes: [{ rep: 56930, dem: 195322 }] },
    { state: "New York", district: 27, votes: [{ rep: 175509, dem: 107832 }] },
    {
      state: "North Carolina",
      district: 1,
      votes: [{ rep: 101567, dem: 240661, lib: 8471 }]
    },
    {
      state: "North Carolina",
      district: 2,
      votes: [{ rep: 221485, dem: 169082 }]
    },
    {
      state: "North Carolina",
      district: 3,
      votes: [{ rep: 217531, dem: 106170 }]
    },
    {
      state: "North Carolina",
      district: 4,
      votes: [{ rep: 130161, dem: 279380 }]
    },
    {
      state: "North Carolina",
      district: 5,
      votes: [{ rep: 207625, dem: 147887 }]
    },
    {
      state: "North Carolina",
      district: 6,
      votes: [{ rep: 207983, dem: 143167 }]
    },
    {
      state: "North Carolina",
      district: 7,
      votes: [{ rep: 211801, dem: 135905 }]
    },
    {
      state: "North Carolina",
      district: 8,
      votes: [{ rep: 189863, dem: 133182 }]
    },
    {
      state: "North Carolina",
      district: 9,
      votes: [{ rep: 193452, dem: 139041 }]
    },
    {
      state: "North Carolina",
      district: 10,
      votes: [{ rep: 220825, dem: 128919 }]
    },
    {
      state: "North Carolina",
      district: 11,
      votes: [{ rep: 230405, dem: 129103 }]
    },
    {
      state: "North Carolina",
      district: 12,
      votes: [{ rep: 115185, dem: 234115 }]
    },
    {
      state: "North Carolina",
      district: 13,
      votes: [{ rep: 199443, dem: 156049 }]
    },
    {
      state: "North Dakota",
      district: 1,
      votes: [{ rep: 233980, dem: 80377, lib: 23528 }]
    },
    { state: "Ohio", district: 1, votes: [{ rep: 210014, dem: 144644 }] },
    { state: "Ohio", district: 2, votes: [{ rep: 221193, dem: 111694 }] },
    { state: "Ohio", district: 3, votes: [{ rep: 91560, dem: 199791 }] },
    { state: "Ohio", district: 4, votes: [{ rep: 210227, dem: 98981 }] },
    { state: "Ohio", district: 5, votes: [{ rep: 244599, dem: 100392 }] },
    { state: "Ohio", district: 6, votes: [{ rep: 213975, dem: 88780 }] },
    { state: "Ohio", district: 7, votes: [{ rep: 198221, dem: 89638 }] },
    {
      state: "Ohio",
      district: 8,
      votes: [{ rep: 223833, dem: 87794, grn: 13879 }]
    },
    { state: "Ohio", district: 9, votes: [{ rep: 88427, dem: 193966 }] },
    { state: "Ohio", district: 10, votes: [{ rep: 215724, dem: 109981 }] },
    { state: "Ohio", district: 11, votes: [{ rep: 59769, dem: 242917 }] },
    {
      state: "Ohio",
      district: 12,
      votes: [{ rep: 251266, dem: 112638, grn: 13474 }]
    },
    { state: "Ohio", district: 13, votes: [{ rep: 99377, dem: 208610 }] },
    { state: "Ohio", district: 14, votes: [{ rep: 219191, dem: 130907 }] },
    { state: "Ohio", district: 15, votes: [{ rep: 222847, dem: 113960 }] },
    { state: "Ohio", district: 16, votes: [{ rep: 225794, dem: 119830 }] },
    { state: "Oklahoma", district: 1, votes: [], winner: "rep" },
    { state: "Oklahoma", district: 2, votes: [{ rep: 189839, dem: 62387 }] },
    { state: "Oklahoma", district: 3, votes: [{ rep: 227525, dem: 63090 }] },
    {
      state: "Oklahoma",
      district: 4,
      votes: [{ rep: 204143, dem: 76472, lib: 12574 }]
    },
    {
      state: "Oklahoma",
      district: 5,
      votes: [{ rep: 160184, dem: 103273, lib: 17113 }]
    },
    {
      state: "Oregon",
      district: 1,
      votes: [{ rep: 139756, dem: 225391, lib: 12257 }]
    },
    { state: "Oregon", district: 2, votes: [{ rep: 272952, dem: 106640 }] },
    { state: "Oregon", district: 3, votes: [{ dem: 274687 }] },
    {
      state: "Oregon",
      district: 4,
      votes: [{ rep: 157743, dem: 220628, lib: 6527 }]
    },
    { state: "Oregon", district: 5, votes: [{ rep: 160443, dem: 199505 }] },
    {
      state: "Pennsylvania",
      district: 1,
      votes: [{ rep: 53219, dem: 245791 }]
    },
    {
      state: "Pennsylvania",
      district: 2,
      votes: [{ rep: 35131, dem: 322514 }]
    },
    { state: "Pennsylvania", district: 3, votes: [{ rep: 244893 }] },
    {
      state: "Pennsylvania",
      district: 4,
      votes: [{ rep: 220628, dem: 113372 }]
    },
    {
      state: "Pennsylvania",
      district: 5,
      votes: [{ rep: 206761, dem: 101082 }]
    },
    {
      state: "Pennsylvania",
      district: 6,
      votes: [{ rep: 207469, dem: 155000 }]
    },
    {
      state: "Pennsylvania",
      district: 7,
      votes: [{ rep: 225678, dem: 153824 }]
    },
    {
      state: "Pennsylvania",
      district: 8,
      votes: [{ rep: 207263, dem: 173555 }]
    },
    {
      state: "Pennsylvania",
      district: 9,
      votes: [{ rep: 186580, dem: 107985 }]
    },
    {
      state: "Pennsylvania",
      district: 10,
      votes: [{ rep: 211282, dem: 89823 }]
    },
    {
      state: "Pennsylvania",
      district: 11,
      votes: [{ rep: 199421, dem: 113800 }]
    },
    {
      state: "Pennsylvania",
      district: 12,
      votes: [{ rep: 221851, dem: 137353 }]
    },
    { state: "Pennsylvania", district: 13, votes: [{ dem: 239316 }] },
    {
      state: "Pennsylvania",
      district: 14,
      votes: [{ rep: 87999, dem: 255293 }]
    },
    {
      state: "Pennsylvania",
      district: 15,
      votes: [{ rep: 190618, dem: 124129, lib: 11727 }]
    },
    {
      state: "Pennsylvania",
      district: 16,
      votes: [{ rep: 168669, dem: 134586, lib: 10518 }]
    },
    {
      state: "Pennsylvania",
      district: 17,
      votes: [{ rep: 135430, dem: 157734 }]
    },
    { state: "Pennsylvania", district: 18, votes: [{ rep: 293684 }] },
    {
      state: "Rhode Island",
      district: 1,
      votes: [{ rep: 71023, dem: 130534 }]
    },
    {
      state: "Rhode Island",
      district: 2,
      votes: [{ rep: 70301, dem: 133108 }]
    },
    {
      state: "South Carolina",
      district: 1,
      votes: [{ rep: 190410, dem: 110539, lib: 11614 }]
    },
    {
      state: "South Carolina",
      district: 2,
      votes: [{ rep: 183746, dem: 105306 }]
    },
    {
      state: "South Carolina",
      district: 3,
      votes: [{ rep: 196325, dem: 72933 }]
    },
    {
      state: "South Carolina",
      district: 4,
      votes: [{ rep: 198648, dem: 91676 }]
    },
    {
      state: "South Carolina",
      district: 5,
      votes: [{ rep: 161669, dem: 105772 }]
    },
    {
      state: "South Carolina",
      district: 6,
      votes: [{ rep: 70099, dem: 177947, lib: 3131, grn: 2499 }]
    },
    {
      state: "South Carolina",
      district: 7,
      votes: [{ rep: 176468, dem: 103454 }]
    },
    {
      state: "South Dakota",
      district: 1,
      votes: [{ rep: 237163, dem: 132810 }]
    },
    { state: "Tennessee", district: 1, votes: [{ rep: 198293, dem: 39024 }] },
    { state: "Tennessee", district: 2, votes: [{ rep: 212455, dem: 68401 }] },
    { state: "Tennessee", district: 3, votes: [{ rep: 176613, dem: 76727 }] },
    { state: "Tennessee", district: 4, votes: [{ rep: 165796, dem: 89141 }] },
    { state: "Tennessee", district: 5, votes: [{ rep: 102433, dem: 171111 }] },
    { state: "Tennessee", district: 6, votes: [{ rep: 202234, dem: 61995 }] },
    { state: "Tennessee", district: 7, votes: [{ rep: 200407, dem: 65226 }] },
    { state: "Tennessee", district: 8, votes: [{ rep: 194386, dem: 70925 }] },
    { state: "Tennessee", district: 9, votes: [{ rep: 41123, dem: 171631 }] },
    {
      state: "Texas",
      district: 1,
      votes: [{ rep: 192434, dem: 62847, lib: 5062 }]
    },
    {
      state: "Texas",
      district: 2,
      votes: [{ rep: 168692, dem: 100231, lib: 6429, grn: 2884 }]
    },
    {
      state: "Texas",
      district: 3,
      votes: [{ rep: 193684, dem: 109420, lib: 10448, grn: 2915 }]
    },
    { state: "Texas", district: 4, votes: [{ rep: 216643, lib: 29577 }] },
    { state: "Texas", district: 5, votes: [{ rep: 155469, lib: 37406 }] },
    {
      state: "Texas",
      district: 6,
      votes: [{ rep: 159444, dem: 106667, grn: 7185 }]
    },
    { state: "Texas", district: 7, votes: [{ rep: 143542, dem: 111991 }] },
    { state: "Texas", district: 8, votes: [{ rep: 236379 }] },
    { state: "Texas", district: 9, votes: [{ rep: 36491, dem: 152032 }] },
    {
      state: "Texas",
      district: 10,
      votes: [{ rep: 179221, dem: 120170, lib: 13209 }]
    },
    { state: "Texas", district: 11, votes: [{ rep: 201871, lib: 23677 }] },
    {
      state: "Texas",
      district: 12,
      votes: [{ rep: 196482, dem: 76029, lib: 10604 }]
    },
    {
      state: "Texas",
      district: 13,
      votes: [{ rep: 199050, lib: 14725, grn: 7467 }]
    },
    { state: "Texas", district: 14, votes: [{ rep: 160631, dem: 99054 }] },
    {
      state: "Texas",
      district: 15,
      votes: [{ rep: 66877, dem: 101712, grn: 5448, lib: 3442 }]
    },
    {
      state: "Texas",
      district: 16,
      votes: [{ dem: 150228, grn: 7510, lib: 17491 }]
    },
    {
      state: "Texas",
      district: 17,
      votes: [{ rep: 149417, dem: 86603, lib: 9708 }]
    },
    {
      state: "Texas",
      district: 18,
      votes: [{ rep: 48306, dem: 150157, grn: 5845 }]
    },
    {
      state: "Texas",
      district: 19,
      votes: [{ rep: 176314, lib: 17376, grn: 9785 }]
    },
    {
      state: "Texas",
      district: 20,
      votes: [{ dem: 149640, lib: 29055, grn: 8974 }]
    },
    {
      state: "Texas",
      district: 21,
      votes: [{ rep: 202967, dem: 129765, lib: 14735, grn: 8564 }]
    },
    { state: "Texas", district: 22, votes: [{ rep: 181864, dem: 123679 }] },
    {
      state: "Texas",
      district: 23,
      votes: [{ rep: 110577, dem: 107526, lib: 10862 }]
    },
    {
      state: "Texas",
      district: 24,
      votes: [{ rep: 154845, dem: 108389, lib: 8625, grn: 3776 }]
    },
    {
      state: "Texas",
      district: 25,
      votes: [{ rep: 180988, dem: 117073, lib: 12135 }]
    },
    {
      state: "Texas",
      district: 26,
      votes: [{ rep: 211730, dem: 94507, lib: 12843 }]
    },
    { state: "Texas", district: 27, votes: [{ rep: 142251, dem: 88329 }] },
    {
      state: "Texas",
      district: 28,
      votes: [{ rep: 57740, dem: 122086, grn: 4616 }]
    },
    {
      state: "Texas",
      district: 29,
      votes: [{ rep: 31646, dem: 95649, lib: 3234, grn: 1453 }]
    },
    {
      state: "Texas",
      district: 30,
      votes: [{ rep: 41518, dem: 170502, lib: 4753, grn: 2053 }]
    },
    {
      state: "Texas",
      district: 31,
      votes: [{ rep: 166060, dem: 103852, lib: 14676 }]
    },
    {
      state: "Texas",
      district: 32,
      votes: [{ rep: 162868, lib: 43490, grn: 22813 }]
    },
    { state: "Texas", district: 33, votes: [{ rep: 33222, dem: 93147 }] },
    { state: "Texas", district: 34, votes: [{ rep: 62323, dem: 104638 }] },
    {
      state: "Texas",
      district: 35,
      votes: [{ rep: 62384, dem: 124612, lib: 6504, grn: 4076 }]
    },
    { state: "Texas", district: 36, votes: [{ rep: 193675, grn: 24890 }] },
    {
      state: "Utah",
      district: 1,
      votes: [{ rep: 182925, dem: 73380, lib: 16296 }]
    },
    { state: "Utah", district: 2, votes: [{ rep: 170524, dem: 93778 }] },
    { state: "Utah", district: 3, votes: [{ rep: 209589, dem: 75716 }] },
    { state: "Utah", district: 4, votes: [{ rep: 147597, dem: 113413 }] },
    { state: "Vermont", district: 1, votes: [{ dem: 264414 }] },
    { state: "Virginia", district: 1, votes: [{ rep: 230213, dem: 140785 }] },
    { state: "Virginia", district: 2, votes: [{ rep: 190475, dem: 119440 }] },
    { state: "Virginia", district: 3, votes: [{ rep: 103289, dem: 208337 }] },
    { state: "Virginia", district: 4, votes: [{ rep: 145731, dem: 200136 }] },
    { state: "Virginia", district: 5, votes: [{ rep: 207758, dem: 148339 }] },
    { state: "Virginia", district: 6, votes: [{ rep: 225471, dem: 112170 }] },
    { state: "Virginia", district: 7, votes: [{ rep: 218057, dem: 160159 }] },
    { state: "Virginia", district: 8, votes: [{ rep: 98387, dem: 246653 }] },
    { state: "Virginia", district: 9, votes: [{ rep: 212838, dem: 87877 }] },
    { state: "Virginia", district: 10, votes: [{ rep: 210791, dem: 187712 }] },
    { state: "Virginia", district: 11, votes: [{ dem: 247818 }] },
    { state: "Washington", district: 1, votes: [{ rep: 155779, dem: 193619 }] },
    { state: "Washington", district: 2, votes: [{ rep: 117094, dem: 208314 }] },
    { state: "Washington", district: 3, votes: [{ rep: 193457, dem: 119820 }] },
    { state: "Washington", district: 4, votes: [{ rep: 132517 + 97402 }] },
    { state: "Washington", district: 5, votes: [{ rep: 192959, dem: 130575 }] },
    { state: "Washington", district: 6, votes: [{ rep: 126116, dem: 201718 }] },
    { state: "Washington", district: 7, votes: [{ dem: 212010 + 166744 }] },
    { state: "Washington", district: 8, votes: [{ rep: 193145, dem: 127720 }] },
    { state: "Washington", district: 9, votes: [{ rep: 76317, dem: 205165 }] },
    {
      state: "Washington",
      district: 10,
      votes: [{ rep: 120104, dem: 170460 }]
    },
    {
      state: "West Virginia",
      district: 1,
      votes: [{ rep: 163469, dem: 73534 }]
    },
    {
      state: "West Virginia",
      district: 2,
      votes: [{ rep: 140807, dem: 101207 }]
    },
    {
      state: "West Virginia",
      district: 3,
      votes: [{ rep: 140741, dem: 49708, lib: 16883 }]
    },
    {
      state: "Wisconsin",
      district: 1,
      votes: [{ rep: 230072, dem: 107003, lib: 7486 }]
    },
    { state: "Wisconsin", district: 2, votes: [{ rep: 124044, dem: 273537 }] },
    { state: "Wisconsin", district: 3, votes: [{ dem: 257401, rep: 169 }] },
    { state: "Wisconsin", district: 4, votes: [{ dem: 220181, lib: 32183 }] },
    {
      state: "Wisconsin",
      district: 5,
      votes: [{ rep: 260706, dem: 114477, lib: 15324 }]
    },
    { state: "Wisconsin", district: 6, votes: [{ rep: 204147, dem: 133072 }] },
    { state: "Wisconsin", district: 7, votes: [{ rep: 223418, dem: 138643 }] },
    { state: "Wisconsin", district: 8, votes: [{ rep: 227892, dem: 135682 }] },
    {
      state: "Wyoming",
      district: 1,
      votes: [{ rep: 156176, dem: 75466, lib: 9033 }]
    }
  ]
};

export default voteData;
