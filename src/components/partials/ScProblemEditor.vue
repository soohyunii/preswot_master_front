<template>
  <div>
    <h1>Problem</h1>

    <el-row>
      <el-col :span="6">
        문항 내용
      </el-col>
      <el-col :span="18">
        <el-input
          type="textarea"
          :rows="3"
          v-model="description"
        >
          <!-- v-model="description" -->
        </el-input>
      </el-col>
      <el-col :span="6">
				정답 공개 여부
      </el-col>
			<el-col :span="18">
				<el-radio-group v-model="radio5">
					<el-radio-button label="open">공개</el-radio-button>
					<el-radio-button label="close">비공개</el-radio-button>
				</el-radio-group>
			</el-col>
			<el-col :span="6">
				정답 유형
      </el-col>
			<el-col :span="18">
				<el-radio-group v-model="problemType">
					<el-radio-button label="multipleChoice">객관식</el-radio-button>
					<el-radio-button label="shortAnswer">주관식</el-radio-button>
					<el-radio-button label="writeOutAnswer">서술형</el-radio-button>
				</el-radio-group>
      </el-col>
    
      <template v-if="problemType">
        <el-col :span="18">
          <el-input
            placeholder="Please input"
            v-model="input10"
            clearable>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-radio-group v-model="radio5">
            <el-radio-button label="correct">정답</el-radio-button>
            <el-radio-button label="incorrect">오답</el-radio-button>
				  </el-radio-group>
        </el-col>
        <el-col :span="24">
          <el-button type="primary" icon="el-icon-circle-plus-outline">추가하기</el-button>
        </el-col>
				</template>
				<template v-else-if="problemType">
          <el-col :span="6">
				    정답:
          </el-col>
          <el-col :span="18">
				    <el-input
              placeholder="Please input"
              v-model="input10"
              clearable>
            </el-input>
          </el-col>
				</template>
				<template v-else>
          <el-col :span="6">
				    정답:
          </el-col>
          <el-col :span="18">
				    <el-input
              type="textarea"
              :rows="8"
              v-model="test"
            >
            </el-input>
          </el-col>
				</template>
			
    </el-row>
    <!-- TODO: delete debug -->
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import Upload from './Upload';

/**
 * @description 강의자료 에디터
 */
export default {
  name: 'ScMaterialEditor',
  methods: {
    ...mapMutations('teacher', ['updateCurrentEditingScItem']),
  },
  computed: {
    ...mapGetters('teacher', ['currentEditingScItem']),
    ...mapState('teacher', ['sc', 'currentEditingScItemIndex']), // TODO: delete 'sc' from list
    problemType: {

    },
    description: {
      get() {
        const vm = this;
        if (!!vm.currentEditingScItem) { // eslint-disable-line no-extra-boolean-cast
          return vm.currentEditingScItem.description || '';
        }
        return '';
      },
      set(description) {
        const vm = this;
        vm.updateCurrentEditingScItem({
          currentEditingScItem: {
            ...vm.currentEditingScItem,
            description,
          },
          lectureElementIndex: vm.currentEditingScItemIndex,
        });
      },
    },
  },
  components: {
    Upload,
  },
};
</script>
